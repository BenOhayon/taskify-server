const express = require("express");
const router = express.Router();
const { 
    registerUser,
    loginUser,
    resetPassword
} = require("../../db/mongo/userModel");
const responseCodes = require('../../responseCodes')
const ServerErrorResponse = require('../../models/ServerErrorResponse')
const ServerDataResponse = require('../../models/ServerDataResponse');
const { sendMail } = require("../../mailer");
const environment = require("../../config");
const { CREATE_PASSWORD_ROUTE } = require("../../constants");

router.post('/register', (req, res) => {
    const { username, email, password } = req.body
    registerUser(username, password, email)
        .then(newUser => res.status(responseCodes.CREATED).json(new ServerDataResponse(responseCodes.CREATED, newUser).generateResponseJson()))
        .catch(error => res.status(error.error ?? responseCodes.SERVER_ERROR).json(
            new ServerErrorResponse(error.error ?? responseCodes.SERVER_ERROR, `Error - ${error}`)
                .generateResponseJson()
        ))
})

router.post('/login', (req, res) => {
    loginUser(req.body.username, req.body.password)
        .then(response => res.json(new ServerDataResponse(responseCodes.OK, response).generateResponseJson()))
        .catch(error => res.json(
            new ServerErrorResponse(error.code, `Error - ${error}`)
            .generateResponseJson()
        ))
})

router.put('/reset-password', (req, res) => {
    const { email, newPassword } = req.body
    resetPassword(email, newPassword)
        .then(updatedUser => {console.log(updatedUser); res.json(new ServerDataResponse(responseCodes.OK, updatedUser).generateResponseJson())})
        .catch(error => {console.log(error); res.json(
            new ServerErrorResponse(responseCodes.SERVER_ERROR, `Error - ${error.error}`)
            .generateResponseJson()
        )})
})

router.post('/forgot-password-request', (req, res) => {
    const { email } = req.body
    const mailOptions = {
        from: "Taskify",
        to: [email],
        subject: "Reset Password Request",
        html: `
            <h3>Password reset request</h3>
            <br/>
            <p>
                This is a password reset request message for <u>${email}</u>.<br/>
                Click <a href="${environment?.baseUrl}${CREATE_PASSWORD_ROUTE}?fromUser=${email}">here</a> to start password reset process
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
