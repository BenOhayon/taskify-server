const express = require("express");
require('dotenv').config()
const cors = require('cors');
const { connectDatabase } = require("./src/db/mongo/mongoConfig");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use('/api', require('./src/routers/api/apiRouter'))

console.log('db connecting...')
connectDatabase(() => {
    console.log('db connected')
    app.listen(process.env.SERVER_APP_PORT, () => {
        console.log('server is running...')
    });
}, err => console.log(err))


