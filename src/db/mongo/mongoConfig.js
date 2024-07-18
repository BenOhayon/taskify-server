const mongoose = require('mongoose');
require('dotenv').config()

function connectDatabase(onSuccess = () => { }, onFailure = () => { }) {
    mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING)
        .then(onSuccess)
        .catch(onFailure)
}

module.exports = {
    connectDatabase
}