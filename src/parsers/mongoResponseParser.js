const { toCamelCase } = require("../utils")

function parseMongoObject(obj) {
    if (!obj) return null
    
    const { _id, __v, password, ...rest } = obj
    return {
        id: _id,
        ...toCamelCase(rest)
    }
}

module.exports = {
    parseMongoObject
}