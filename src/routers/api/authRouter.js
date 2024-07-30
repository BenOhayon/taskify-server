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

/**
 * Creates a user.
 * [POST] /api/auth/register
 * 
 * Body Parameters:
 * @param username - The username of the new user
 * @param password - The password of the new user
 * @param email - The email of the new user
 * 
 * For more info and testing, see {@link http://localhost:3000/api/docs}
 */
router.post('/register', (req, res) => {
    const { username, email, password } = req.body
    registerUser(username, password, email)
        .then(newUser => res.status(responseCodes.CREATED).json(new ServerDataResponse(responseCodes.CREATED, newUser).generateResponseJson()))
        .catch(error => res.status(error.error ?? responseCodes.SERVER_ERROR).json(
            new ServerErrorResponse(error.error ?? responseCodes.SERVER_ERROR, `Error - ${error}`)
                .generateResponseJson()
        ))
})

/**
 * Logs in a user.
 * [POST] /api/auth/login
 * 
 * Body Parameters:
 * @param username - The username of the requested user
 * @param password - The password of the requested user
 * 
 * For more info and testing, see {@link http://localhost:3000/api/docs}
 */
router.post('/login', (req, res) => {
    const { username, password } = req.body
    loginUser(username, password)
        .then(response => res.status(responseCodes.OK).json(new ServerDataResponse(responseCodes.OK, response).generateResponseJson()))
        .catch(error => res.status(error.code).json(
            new ServerErrorResponse(error.code, `Error - ${error}`)
            .generateResponseJson()
        ))
})

/**
 * Updates a user's password.
 * [PUT] /api/auth/reset-password
 * 
 * Body Parameters:
 * @param email - The email of the requested user
 * @param newPassword - The new password of the requested user
 * 
 * For more info and testing, see {@link http://localhost:3000/api/docs}
 */
router.put('/reset-password', (req, res) => {
    const { email, newPassword } = req.body
    resetPassword(email, newPassword)
        .then(updatedUser => res.status(responseCodes.OK).json(new ServerDataResponse(responseCodes.OK, updatedUser).generateResponseJson()))
        .catch(error => res.status(responseCodes.SERVER_ERROR).json(
            new ServerErrorResponse(responseCodes.SERVER_ERROR, `Error - ${error.error}`)
            .generateResponseJson()
        ))
})

/**
 * Sends a reset password link via email.
 * [POST] /api/auth/forgot-password-request
 * 
 * Body Parameters:
 * @param email - The email of the requested user
 * 
 * For more info and testing, see {@link http://localhost:3000/api/docs}
 */
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
