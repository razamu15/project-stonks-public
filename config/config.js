var loginConfig = {};
loginConfig.PORT = 3000;
loginConfig.TOKEN_TTL = 1200;
loginConfig.TOKEN_SECRET = '7H15I5MaiI0G1n63(rEt';
loginConfig.SALT_ROUNDS = 5;

var confluentConfig = {};
confluentConfig.BROKERS = ['pkc-419q3.us-east4.gcp.confluent.cloud:9092'];
confluentConfig.USERNAME = 'BVODY4UAEMXE626R';
confluentConfig.PASSWORD = 'PIE2g0KllOgOOZXUXLP5+Oa+uMH0d+4lkqZfKKo1sgNo9I9WU+E8hO1rlnx7WrBI';

var alpacaConfig = {};
alpacaConfig.KEY = 'PKDDZ1I5NLICTUYTR8PP';
alpacaConfig.SECRET = 'ZajJwY6yqNTlxqechc5sZxy1CT1yuEdOwcdUHjNZ';
alpacaConfig.ENDPOINT = 'https://paper-api.alpaca.markets';

var mongoConfig = {};
mongoConfig.DATABASE = 'stonks';
mongoConfig.USERNAME = 'cluster0';
mongoConfig.PASSWORD = 'Blaovd1j7gYM0q6Q';
mongoConfig.URI = `mongodb+srv://${mongoConfig.USERNAME}:${mongoConfig.PASSWORD}@cluster0.cqdv1.mongodb.net/${mongoConfig.DATABASE}?retryWrites=true&w=majority`;

var redisConfig = {};
redisConfig.REDIS_PORT = 19484;
redisConfig.REDIS_HOST = 'redis-19484.c16.us-east-1-3.ec2.cloud.redislabs.com';
redisConfig.REDIS_PASSWORD = 'j83wqsVpQ4mMFPet2PpNc49bONte4DDx';


module.exports = {
    loginConfig,
    confluentConfig,
    alpacaConfig,
    redisConfig,
    mongoConfig
}