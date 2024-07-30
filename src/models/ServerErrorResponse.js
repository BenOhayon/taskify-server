const responseCodes = require('../responseCodes')
const ServerResponse = require('./ServerResponse')

class ServerErrorResponse extends ServerResponse {
    constructor(responseCode, errorMessage) {
        super(responseCode)
        this.errorMessage = errorMessage
    }

    generateResponseJson() {
        return {
            ...super.generateResponseJson(),
            errorCode: this.responseCode ?? responseCodes.SERVER_ERROR,
            errorMessage: this.errorMessage
        }
    }
}

module.exports = ServerErrorResponse