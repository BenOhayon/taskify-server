const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const responseCodes = require('../../responseCodes');
const { mongoResultToJson } = require('../../utils');

const userSchema = new mongoose.Schema({
    created_at: { 
        type: Number, 
        required: true, 
        immutable: true, 
        default: () => new Date().getTime() 
    },
    username: { 
        type: String, 
        required: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    email: {
        type: String,
        required: false
    }
})

userSchema.methods.generatePasswordHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}

userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.password)
}

const userModel = mongoose.model('users', userSchema)

async function registerUser(username, password, email) {
    const user = await userModel.findOne({ username })
    if (user === null) { // the new user doesn't exist
        const userData = { username, email }
        const newUser = new userModel({ username, email })
        newUser.password = newUser.generatePasswordHash(password)
        const accessToken = jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET)
        return { token: accessToken, user: mongoResultToJson(await newUser.save()) }
    } else {
        throw 'User already exists'
    }
}

async function loginUser(username, password) {
    const user = await userModel.findOne({ username })
    if (user === null) {
        throw {error: 'No user found', code: responseCodes.NOT_FOUND}
    }

    if (user.validatePassword(password)) {
        const userData = { username, email: user?.email }
        const accessToken = jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET)
        return { token: accessToken, user: mongoResultToJson(user) }
    } else {
        throw {error: 'User unauthorized', code: responseCodes.UNAUTHORIZED}
    }
}

async function resetPassword(email, newPassword) {
    const userToUpdate = await userModel.findOne({ email })
    userToUpdate.password = userToUpdate.generatePasswordHash(newPassword)
    return userToUpdate.save()
}

module.exports = {
    registerUser,
    loginUser,
    resetPassword
}