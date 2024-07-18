class ServerResponse {
    constructor(responseCode) {
        this.responseCode = responseCode
    }

    generateResponseJson() {
        return {
            status: this.responseCode < 400
        }
    }
}

module.exports = ServerResponse