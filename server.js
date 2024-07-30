const express = require("express");
require('dotenv').config()
const tasksRouter = require("./src/routers/tasksRouter");
const authRouter = require("./src/routers/authRouter");
const cors = require('cors');
const { validateJWT } = require("./src/validators");
const { connectDatabase } = require("./src/db/mongo/mongoConfig");
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swagger');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api/auth', authRouter)

app.use(validateJWT)
app.use("/api/tasks", tasksRouter)

console.log('db connecting...')
connectDatabase(() => {
    console.log('db connected')
    app.listen(process.env.SERVER_APP_PORT, () => {
        console.log('server is running...')
    });
}, err => console.log(err))


