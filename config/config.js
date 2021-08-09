var loginConfig = {};
loginConfig.PORT = 3000;
loginConfig.TOKEN_TTL = 1200;
loginConfig.TOKEN_SECRET = '';
loginConfig.SALT_ROUNDS = 5;

var confluentConfig = {};
confluentConfig.BROKERS = [''];
confluentConfig.USERNAME = '';
confluentConfig.PASSWORD = '';

var alpacaConfig = {};
alpacaConfig.KEY = '';
alpacaConfig.SECRET = '';
alpacaConfig.ENDPOINT = 'https://paper-api.alpaca.markets';

var mongoConfig = {};
mongoConfig.DATABASE = 'stonks';
mongoConfig.USERNAME = 'cluster0';
mongoConfig.PASSWORD = '';
mongoConfig.URI = `mongodb+srv://${mongoConfig.USERNAME}:${mongoConfig.PASSWORD}@cluster0.cqdv1.mongodb.net/${mongoConfig.DATABASE}?retryWrites=true&w=majority`;

var redisConfig = {};
redisConfig.REDIS_PORT = 19484;
redisConfig.REDIS_HOST = 'redis-19484.c16.us-east-1-3.ec2.cloud.redislabs.com';
redisConfig.REDIS_PASSWORD = '';


module.exports = {
    loginConfig,
    confluentConfig,
    alpacaConfig,
    redisConfig,
    mongoConfig
}
