const express = require("express");
const cors = require('cors');
const { createClient } = require("redis");
const { Pool } = require('pg');

const keys = require("./keys");
const env = process.env.NODE_ENV;

const app = express();
const port = 4000;

app.use(express.json());
app.use(cors());

let pgClient = new Pool({
    user: "postgres",
    // keys.pgUser,
    host: "multi-docker-postgres.cnguos0e45m3.me-south-1.rds.amazonaws.com",
    // keys.pgHost,
    database: "multi_postgres",
    // keys.pgDatabase,
    port: 5432,
    // keys.pgPort,
    password: "rehan_password",
    // keys.pgPassword,
    ssl: env !== 'production' ? false : { rejectUnauthorized: false }
});

pgClient.on('error', () => console.log('Lost PG connection'));

const redisClient = createClient({
    socket: {
        host: "multi-docker-redis-wqdyoa.serverless.mes1.cache.amazonaws.com",
        // keys.redisHost,
        port: 6379,
        //  keys.redisPort,
        reconnectStrategy: () => 1000
    },
});

const redisPublisher = redisClient.duplicate();

app.get('/', (_, res) => {
    res.status(200).send('Bye there');
});

app.get('/values/all', async (req, res) => {
    const values = await pgClient.query('SELECT * from values');
    res.status(200).send(values.rows);
});

app.get('/values/current', async (req, res) => {
    const values = await redisClient.hGetAll('values');
    res.status(200).send(values);
});

app.post('/values', async (req, res) => {
    const index = req.body.index;

    if(index > 40) {
        res.send(422).send({error: "Index too high"});
        return;
    }  

    await redisClient.hSet('values', index, 'Nothing yet');
    await redisPublisher.publish('insert', index);

    await pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);

    res.status(200).send({
        working: true,
    })
});

(async () => {
    try {
        await pgClient.connect();
        await pgClient.query('CREATE TABLE IF NOT EXISTS values (number INT)');

        await redisClient.connect();
        await redisPublisher.connect();
    
        app.listen(port, "127.0.0.1" , () => console.log(`Server listening on port ${port}`));    
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
})()

