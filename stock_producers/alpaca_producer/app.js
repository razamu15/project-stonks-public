const Alpaca = require('@alpacahq/alpaca-trade-api');
const { Kafka } = require('kafkajs')
const redis = require('redis');

const { alpacaConfig, confluentConfig, redisConfig } = require('../../config/config');

// #########################################################################
// ---------------------------   Redis Init    -----------------------------
// #########################################################################

const redisEventClient = redis.createClient({
    host: redisConfig.REDIS_HOST,
    port: redisConfig.REDIS_PORT,
    password: redisConfig.REDIS_PASSWORD
});
const redisReadClient = redis.createClient({
    host: redisConfig.REDIS_HOST,
    port: redisConfig.REDIS_PORT,
    password: redisConfig.REDIS_PASSWORD
});

// #########################################################################
// ---------------------------   Kafka Init    -----------------------------
// #########################################################################

const kafka = new Kafka({
    alpacaClientId: 'my-app',
    brokers: confluentConfig.BROKERS,
    ssl: true,
    sasl: {
        mechanism: 'plain',
        username: confluentConfig.USERNAME,
        password: confluentConfig.PASSWORD
    }
});
const producer = kafka.producer();
producer.connect();


// #########################################################################
// -------------------------   Alpaca Section    ---------------------------
// #########################################################################

// create alpaca client
const alpaca = new Alpaca({
    keyId: alpacaConfig.KEY,
    secretKey: alpacaConfig.SECRET,
    paper: true,
    usePolygon: false
});

const alpacaClient = alpaca.data_ws;
var currentRealTimeStocks = [];

//set handlers that will be run when we subscribe and get updates
alpacaClient.onConnect(function () {
    console.log("Alpaca client connected, calling subscribe with", currentRealTimeStocks);
    alpacaClient.subscribe(currentRealTimeStocks);
});
alpacaClient.onDisconnect(function () {
    console.log("Alpaca client disconnected, calling reconnect");
    alpacaClient.reconnect();
});
alpacaClient.onStockAggMin((subject, data) => {
    console.log(`data: ${JSON.stringify(data)}`)
    producer.send({
        topic: 'Stocks',
        messages: [
            { key: data.symbol, value: JSON.stringify(data)},
        ],
    });
});
// alpacaClient.onStockTrades(function (subject, data) {
//     console.log(`Stock trades: ${subject}, data: ${JSON.stringify(data)}`)
//     console.log(alpacaClient.subscriptions());
// });

alpacaClient.connect();

// #########################################################################
// ----------------------   Redis Events Section    ------------------------
// #########################################################################


redisEventClient.config('set', 'notify-keyspace-events', 'KA');
// subscribe to the key event so we get notificated if a value changes
redisEventClient.subscribe('__keyspace@0__:realtimeStocks');

redisEventClient.on('message', function (channel, key) {
    // there was an update to the key, so we set this new list as our subscriptions
    redisReadClient.get('realtimeStocks', function (err, value) {
        // unsubscriobe from last list of stocks we were following
        console.log("change happended in db current list in memory", currentRealTimeStocks);

        alpacaClient.unsubscribe(currentRealTimeStocks);        
        // set subscriptions as new list
        currentRealTimeStocks = JSON.parse(value).map(stckobj => `alpacadatav1/AM.${stckobj.stock}`);
        // disconnect
        alpacaClient.disconnect();
    });
});
