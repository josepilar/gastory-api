const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const api = require('./api');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

const { DB_USER, DB_PASSWORD, DB_NAME, DB_HOST, DB_PORT } = process.env;
const conectionString = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
// Connect to Mongoose and set connection variable
mongoose.connect(conectionString, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
app.use('/api', api);

db.on('error', console.log.bind(console, 'connection error:'));

db.once('open', function () {
    console.log('Connected to db.');

    app.listen(process.env.PORT || 3001, () =>
        console.log(`Express server is running on localhost:${process.env.PORT || 3001}`)
    );
});

