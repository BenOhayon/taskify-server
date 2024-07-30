const express = require("express");
const router = express.Router();
const { validateJWT } = require("../../validators");
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('../../../swagger.json');

router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
router.use('/auth', require("../api/authRouter"))
router.use(validateJWT)
router.use("/tasks", require("../api/tasksRouter"))

module.exports = router