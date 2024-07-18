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

async function registerUser(username, password) {
    const user = await userModel.findOne({ username })
    if (user === null) { // the new user doesn't exist
        const newUser = new userModel({ username })
        newUser.password = newUser.generatePasswordHash(password)
        return mongoResultToJson(await newUser.save())
    } else {
        throw new Error('User already exists')
    }
}

function loginUser(username, password) {
    return new Promise((resolve, reject) => {
        console.log(username)
        userModel.findOne({ username })
            .then(user => {
                if (user === null) {
                    reject({error: 'No user found', code: responseCodes.NOT_FOUND})
                }

                if (user.validatePassword(password)) {
                    const userData = { username }
                    const accessToken = jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET)
                    resolve({ token: accessToken, user: mongoResultToJson(user) })
                } else {
                    reject({error: 'User unauthorized', code: responseCodes.UNAUTHORIZED})
                }
            })
            .catch(error => reject({error, code: responseCodes.SERVER_ERROR}))
    })
}

module.exports = {
    registerUser,
    loginUser
}

// twillo 2FA recovery code: Z2WLRFSWA3X23RPWJR8QQDTC