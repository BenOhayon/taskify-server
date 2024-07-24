const { parseMongoObject } = require("./parsers/mongoResponseParser")

function mongoResultToJson(result) {
    const mongoJson = JSON.parse(JSON.stringify(result))
    return parseMongoObject(mongoJson)
}

function mongoResultToJsonArray(result) {
    const mongoJsonArray = JSON.parse(JSON.stringify(result))
    return mongoJsonArray.map(item => parseMongoObject(item))
}

function snakeCaseToCamelCase(item) {
    if (Array.isArray(item)) {
        return item.map(el => recursiveToCamel(el))
    } else if (typeof item === 'function' || item !== Object(item)) {
        return item
    }
    return Object.fromEntries(
        Object.entries(item).map(([key, value]) => [
            key.replace(/([-_][a-z])/gi, c => c.toUpperCase().replace(/[-_]/g, '')),
            recursiveToCamel(value)
        ])
    )
}

module.exports = {
    mongoResultToJson,
    mongoResultToJsonArray,
    snakeCaseToCamelCase
}