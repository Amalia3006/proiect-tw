const { send } = require("../views");

class apiRoutesHandler {
    static login(request, response) {
        send(405, response);
    }

    static register(request, response) {
        send(405, response);
    }

    static logout(request, response) {
        send(405, response);
    }

    static profile(request, response) {
        send(405, response);
    }

    static jobs(request, response) {
        send(405, response);
    }

    static events(request, response) {
        send(405, response);
    }
}

module.exports = apiRoutesHandler;
