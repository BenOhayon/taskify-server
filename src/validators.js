const ServerErrorResponse = require('./models/ServerErrorResponse')
const responseCodes = require('./responseCodes')
const jwt = require('jsonwebtoken')

function validateJWT(req, res, next) {
    const bearer = req.headers.authorization
    const token = bearer && bearer.split(" ")[1]
    if (!token) {
        res.status(responseCodes.BAD_REQUEST).json(new ServerErrorResponse(responseCodes.BAD_REQUEST, `Error - authentication token is required`))
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            res.status(responseCodes.BAD_REQUEST).json(new ServerErrorResponse(responseCodes.UNAUTHORIZED, `Error - user unauthorized`))
        }
        next()
    })
}

module.exports = {
    validateJWT
}