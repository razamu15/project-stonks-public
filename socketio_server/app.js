const { Kafka } = require('kafkajs')
const jwt = require("jsonwebtoken");
const httpServer = require("http").createServer();
const MongoClient = require('mongodb').MongoClient;
const redis = require('redis');
const { loginConfig, confluentConfig, mongoConfig, redisConfig } = require('../config/config');

// set up redis connection
const redisClient = redis.createClient({
    host: redisConfig.REDIS_HOST,
    port: redisConfig.REDIS_PORT,
    password: redisConfig.REDIS_PASSWORD
});

// connect to mongoDB
var mongoDB;
const client = new MongoClient(mongoConfig.URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
client.connect( (err, returnedClient) => {
    if (err) {
        console.error(err);    
    } else {
        mongoDB = returnedClient.db("stonks");
    }
});

const io = require("socket.io")(httpServer);

// auth middleware for connections
io.use( async (socket, next) => {
    // get the token from the socket handshake
    const token = socket.handshake.auth.token;
    if (token == null) next(new Error("No Auth Token Found In Request"));
    
    jwt.verify(token, loginConfig.TOKEN_SECRET, function (err, decoded) {
        if (err) {
            // console.log("expired token", token);
            next(new Error("Token Verification Failed, Most Likely Expired"));
        } else {
            // console.log("valid token", decoded);
            socket.userID = decoded.userID
            next();
        }
    });
});

const stocksNamespace = io.of('/stocks');

// i basically need 1 room per stock
// the socket of any user x will be in 's' rooms if they follow 's' stocks
var stockRooms = []; // [ {stock:'', count:0} ]

stocksNamespace.on("connection", (socket) => {
    socket.emit("success", "socket connected");

    socket.on("subscribe", (stocks) => {
        // add socket to corresponding rooms
        stocks.forEach((stock) => {
            let roomIndex = stockRooms.findIndex(rm => rm.stock === stock);
            if (roomIndex != -1) {
                // a room for this stock already exists so add this user's socket to that room
                socket.join(stock);
                stockRooms[roomIndex].count += 1;
            } else {
                // a room for this stock doesnt exist already, so we create it
                stockRooms.push({ stock:stock, count: 1 });
                socket.join(stock);
            }
        });
        // update the redis cache for state management with stock producer
        redisClient.set("realtimeStocks", JSON.stringify(stockRooms));
        // akert clinet side
        socket.emit("success", "received stocks to follow, stream initialized");
    });

    socket.on("disconnecting", (reason) => {
        let stockRoomsList = stockRooms.filter(rm => socket.rooms.has(rm.stock));
        stockRoomsList.forEach(elem => {
            let roomIndex = stockRooms.findIndex(el => el.stock === elem.stock);

            if (elem.count > 1) {
                stockRooms[roomIndex].count -= 1;
            } else {
                stockRooms.splice(roomIndex, 1);
            }
        });
        // update the redis cache for state management with stock producer
        redisClient.set("realtimeStocks", JSON.stringify(stockRooms));
    });
});


const groupsNamespace = io.of('/groups');

var groupRooms = [];

groupsNamespace.on("connection", (socket) => {
    socket.emit("success", "socket connected");

    socket.on("subscribe", (stocks) => {
        stocks.forEach((stock) => {
            let roomIndex = groupRooms.findIndex(rm => rm.stock === stock);
            if (roomIndex != -1) {
                // a room for this stock already exists so add this user's socket to that room
                socket.join(stock);
                groupRooms[roomIndex].count += 1;
            } else {
                // a room for this stock doesnt exist already, so we create it
                groupRooms.push({ stock:stock, count: 1 });
                socket.join(stock);
            }
        });
        socket.emit("success", "received groupid, stream initialized");
    });

    socket.on("message", (data) =>{
        groupsNamespace.to(data.groupID).emit('message', data);
        //add to mongo db here
        let msg = {
            groupID: data.groupID,
            userID: data.userID,
            content: data.userMessage,
            createdAt: (new Date()).toUTCString(),
            context: data.context
        }
        mongoDB.collection("Messages").insertOne(msg);
    });

    socket.on("disconnecting", (reason) => {
        let groupRoomsList = groupRooms.filter(rm => socket.rooms.has(rm.stock));
        groupRoomsList.forEach(elem => {
            let roomIndex = groupRooms.findIndex(el => el.stock === elem.stock);

            if (elem.count > 1) {
                groupRooms[roomIndex].count -= 1;
            } else {
                groupRooms.splice(roomIndex, 1);
            }
        });
    });
});


// Create the client with the broker list
const kafka = new Kafka({
    clientId: 'my-app',
    brokers: confluentConfig.BROKERS,
    ssl: true,
    sasl: {
        mechanism: 'plain',
        username: confluentConfig.USERNAME,
        password: confluentConfig.PASSWORD
    }
});
const consumer = kafka.consumer({ groupId: 'socketio-server' });
consumer.connect();
consumer.subscribe({ topic: 'Stocks' });

consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
        // message key is the stock ticker
        let ticker = message.key.toString();
        // now every time we get a stock message, we check if it is in stockRooms
        let roomIndex = stockRooms.findIndex(rm => rm.stock === ticker);
        if (roomIndex != -1) {
            // this means that there are users that need to receive updates for this stock
            let packet = {stock: ticker, ...JSON.parse(message.value.toString())}
            stocksNamespace.to(ticker).emit('stock_update', JSON.stringify(packet));
        } else {
            // else this stock is not being watched by anyone logged in rn so we just lef it
            console.log(`no one watching ${message.key}`);
        }
        // console.log(`coming from ${topic}\n`, {
        //     key: message.key.toString(),
        //     value: message.value.toString(),
        //     headers: message.headers,
        // })
    },
});


httpServer.listen(8000, () => console.log(`Listening on port ${8000}`));