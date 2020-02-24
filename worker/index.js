// primary logic for connecting to redis and calculating fibonnaci value

const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

const sub = redisClient.duplicate();

// fibonacci recursive function solution
function fib(index) {
    if (index < 2) return 1;
    return fib(index - 1) + fib(index - 2);
}


//subscription to watch redis looking for new values
sub.on('message', (channel, message) => {
    redisClient.hset('values', message, fib(parseInt(message)));
});

// any time someone inserts a value into Redis
sub.subscribe('insert');
