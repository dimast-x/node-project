const express = require('express')
var request = require('request');

const app = express()
app.use(logger)

app.get('/bitcoin', function (req, res, next) {
    request({
        uri: 'https://api.coindesk.com/v1/bpi/currentprice.json',
        method: 'GET',
    }).pipe(res);
});

const userRouter = require('./routes/users')
const itemsRouter = require('./routes/items')

app.use('/users', userRouter)
app.use('/items', itemsRouter)

function logger(req, res, next) {
    console.log(req.method, req.originalUrl)
    next()
}

app.listen(3000)