const express = require("express");
const router = express.Router();
const { 
    registerUser,
    loginUser
} = require("../db/mongo/userModel");
const responseCodes = require('../responseCodes')
const ServerErrorResponse = require('../models/ServerErrorResponse')
const ServerDataResponse = require('../models/ServerDataResponse');
const { sendMail } = require("../mailer");
const environment = require("../config");
const { CREATE_PASSWORD_ROUTE } = require("../constants");

router.post('/register', (req, res) => {
    registerUser(req.body.username, req.body.password)
        .then(newUser => res.json(new ServerDataResponse(responseCodes.OK, newUser).generateResponseJson()))
        .catch(error => res.json(
            new ServerErrorResponse(responseCodes.SERVER_ERROR, `Error - ${error}`)
                .generateResponseJson()
        ))
})

router.post('/login', (req, res) => {
    loginUser(req.body.username, req.body.password)
        .then(response => res.json(new ServerDataResponse(responseCodes.OK, response).generateResponseJson()))
        .catch(error => res.json(
            new ServerErrorResponse(error.code, `Error - ${error.error}`)
            .generateResponseJson()
        ))
})

router.post('/forgot-password-request', (req, res) => {
    const mailOptions = {
        from: "Taskify",
        to: [req.body?.email],
        subject: "Reset Password Request",
        html: `
            <h3>Password reset request</h3>
            <br/>
            <p>
                This is a password reset request message for <u>${req.body?.email}</u>.
                Click <a href="${environment?.baseUrl}${CREATE_PASSWORD_ROUTE}">here</a> to start password reset process:
                <br/>
            </p>
        `
    }
    sendMail(mailOptions)
        .then(() => {
            console.log('mail sent successfully')
            return res.json(new ServerDataResponse(responseCodes.OK, {}).generateResponseJson())
        })
        .catch(error => {
            console.log('mail didn\'t sent successfully: ', error.error)
            return res.json(
                new ServerErrorResponse(error.code, `Error - ${error.error}`)
                .generateResponseJson()
            )
        })
})

module.exports = router
