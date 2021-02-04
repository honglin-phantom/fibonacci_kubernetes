// file that stores the host name and port to connect to Redis 
const keys = require('./keys'); 

// import redis client 
const redis = require('redis'); 
// instantiate redis client and reconnect redis server for every 1 second 
const redisClient = redis.createClient({
    host: keys.redisHost, 
    port: keys.redisPort, 
    retry_strategy: () => 1000
}); 

// create a subscription on redis client to listen for a specific message
const sub = redisClient.duplicate(); 

// primary logic that calculates Fibonacci sequence given a specific index 
function fib(index) {
    if (index < 2) return 1;
    return fib(index - 1) + fib(index - 2); 
}

sub.on('message', (channel, index) => {
    // store the calculated Fibonacci number to the hash of values as a key-value pair which key is the index and value is the Fib number
    redisClient.hset('values', index, fib(parseInt(index)));
}); 

// subscribe to insert event 
sub.subscribe('insert'); 