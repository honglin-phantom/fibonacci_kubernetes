const keys = require('./keys');  

// -------------- Express App Setup - instantiate library instance --------------
const express = require('express'); 
const bodyParser = require('body-parser'); 
const cors = require('cors'); 

// create express app from express library instance 
const app = express(); 
app.use(cors()); 
app.use(bodyParser.json()); 

// -------------- Postgres Client Setup ---------------
const { Pool } = require('pg');  
const { query } = require('express');
const pgClient = new Pool({
    user: keys.pgUser, 
    host: keys.pgHost, 
    port: keys.pgPort, 
    password: keys.pgPassword, 
    database: keys.pgDatabase
}); 

// create new table values with one column number with type INT 
pgClient.on('connect', () => {
    pgClient
        .query('CREATE TABLE IF NOT EXISTS values (number INT)')
        .catch((err) => console.log(err));
}); 

// ---------------- Redis Client Setup ------------------
const redis = require('redis'); 
// connection purpose only 
const redisClient = redis.createClient({
    host: keys.redisHost, 
    port: keys.redisPort, 
    retry_strategy: () => 1000
});
// listen and publish purpose only 
const redisPublisher = redisClient.duplicate(); 

// ---------------- Express Route Handlers -----------------
app.get('/', (req, res) => {
    res.send('Hello'); 
}); 

// HTTP GET: api call to Postgres to retrieve all stored index values so far 
app.get('/values/all', async (req, res) => {
    const values = await pgClient.query('SELECT * FROM values'); 

    // only retrieve index from the Query Result
    res.send(values.rows);
}); 

// HTTP GET: api call to Redis to retrieve all stored indexes and Fibonacci numbers so far 
app.get('/values/current', async (req, res) => {
    redisClient.hgetall('values', (err, values) => {
        res.send(values); 
    }); 
})

// HTTP POST: api call to Redis to submit user input from React 
app.post('/values', async (req, res) => {
    // get user input index 
    const index = req.body.index;

    if (index > 40) {
        return res.status(422).send('Index too high'); 
    }

    // store user input into redis (note: worker thread will handle the real calculation)
    redisClient.hset('values', index, 'Nothing yet!'); 

    // publish a new insert event for catch up from subscribers
    redisPublisher.publish('insert', index); 

    // store user input into Postgres permanently 
    pgClient.query('INSERT INTO values(number) VALUES($1)', [index]); 

    res.send({
        working: true
    }); 
}); 

app.listen(5000, () => {
    console.log('Listening on port 5000'); 
});