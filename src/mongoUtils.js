const { parseMongoObject } = require("./parsers/mongoResponseParser")

function mongoResultToJson(result) {
    const mongoJson = JSON.parse(JSON.stringify(result))
    return parseMongoObject(mongoJson)
}

function mongoResultToJsonArray(result) {
    const mongoJsonArray = JSON.parse(JSON.stringify(result))
    return mongoJsonArray.map(item => parseMongoObject(item))
}

module.exports = {
    mongoResultToJson,
    mongoResultToJsonArray
}