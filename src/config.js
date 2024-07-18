const envName = process.env.ENV

const envs = {
    debug: {
        baseUrl: `http://localhost:${process.env.CLIENT_APP_PORT}`
    }
}

let environment = {}

switch (envName) {
    case 'debug':
        environment = envs.debug
        break
    default:
        environment = {}
}

module.exports = environment