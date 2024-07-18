const ServerResponse = require('./ServerResponse')

class ServerErrorResponse extends ServerResponse {
    constructor(responseCode, errorMessage) {
        super(responseCode)
        this.errorMessage = errorMessage
    }

    generateResponseJson() {
        return {
            ...super.generateResponseJson(),
            errorCode: this.responseCode,
            errorMessage: this.errorMessage
        }
    }
}

module.exports = ServerErrorResponse