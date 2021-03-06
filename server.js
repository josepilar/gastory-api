const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cookieParser = require("cookie-parser");

const api = require('./api');

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
    origin: process.env.UI_URL
}));

// DATA BASE CONNECTION
const { DB_USER, DB_PASSWORD, DB_NAME, DB_HOST, DB_PORT } = process.env;
const conectionString = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
// Connect to Mongoose and set connection variable
mongoose.connect(conectionString, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
var db = mongoose.connection;


app.use('/api', api);

db.on('error', console.log.bind(console, 'connection error:'));

db.once('open', function () {
    console.log('Connected to db.');

    app.listen(process.env.PORT || 3001, () =>
        console.log(`Express server is running on localhost:${process.env.PORT || 3001}`)
    );
});

