
function toCamelCase(item) {
    if (Array.isArray(item)) {
        return item.map(el => toCamelCase(el))
    } else if (typeof item === 'function' || item !== Object(item)) {
        return item
    }
    return Object.fromEntries(
        Object.entries(item).map(([key, value]) => [
            key.replace(/([-_][a-z])/gi, c => c.toUpperCase().replace(/[-_]/g, '')),
            toCamelCase(value)
        ])
    )
}

module.exports = {
    toCamelCase
}