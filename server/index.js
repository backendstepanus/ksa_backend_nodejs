const http = require('http');
const express = require('express');
const app = express();
const Character_apiRouter = require('../routes/character_api')
const hostname = '127.0.0.1';
const port = 3000;
const bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.use(express.urlencoded({
    extended: true,
}));
// const server = http.createServer((req, res) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     res.end('Hello World');
// });

require('dotenv').config();
const {
    DB_USER,
    DB_HOST,
    DB_DATABASE,
    DB_PASSWORD,
    DB_PORT
} = process.env;

const { Pool } = require("pg");
const pool = new Pool({
    user: DB_USER,
    host: DB_HOST,
    database: DB_DATABASE,
    password: DB_PASSWORD,
    port: DB_PORT
});

pool.connect((err) => {
    if (err) throw err;
    console.log('Postgre Connected...');
});

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

// server.listen(port, hostname, () => {
//     console.log("Server is running on " + port);
// });

app.use('/character_api', Character_apiRouter)