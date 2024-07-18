const ServerResponse = require('./ServerResponse')

class ServerDataResponse extends ServerResponse {
    constructor(responseCode, data) {
        super(responseCode)
        this.responseData = data
    }

    generateResponseJson() {
        return {
            ...super.generateResponseJson(),
            data: this.responseData
        }
    }
}

module.exports = ServerDataResponse