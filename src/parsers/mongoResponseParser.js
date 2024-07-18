
function parseMongoObject(obj) {
    if (!obj) return null
    
    const { _id, __v, password, ...rest } = obj
    return {
        id: _id,
        ...rest
    }
}

module.exports = {
    parseMongoObject
}