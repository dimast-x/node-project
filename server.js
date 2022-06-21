const express = require('express')
var request = require('request');
const userRouter = require('./routes/users')
const itemsRouter = require('./routes/items')
const db = require('./db.js')

const app = express()

async function checkDBConnection() {
    try {
        await db.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

checkDBConnection()
app.use(logger)
app.use(express.json());

app.use('/users', userRouter)
app.use('/items', itemsRouter)

app.get('/bitcoin', function (req, res, next) {
    request({
        uri: 'https://api.coindesk.com/v1/bpi/currentprice.json',
        method: 'GET',
    }).pipe(res);
});

function logger(req, res, next) {
    console.log(req.method, req.originalUrl)
    next()
}

app.listen(3000)