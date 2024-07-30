const express = require("express");
const router = express.Router();
const { validateJWT } = require("../../validators");
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('../../../swagger.json');
const tasksRouter = require("../api/tasksRouter");
const authRouter = require("../api/authRouter");

router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
router.use('/auth', authRouter)
router.use(validateJWT)
router.use("/tasks", tasksRouter)

module.exports = router