const nunjucks = require("nunjucks");

let views = {};
const viewsDir = "./views";

function init() {
    // nunjucks.configure(viewsDir);
    const templates = [
        "firstPageNoLog.njk",
        "firstPageLoggedin.njk",
        "pageJobs.njk",
        "pageOportunity.njk",
        "pageProfile.njk",
        "pageSignIn.njk",
        "pageSignUp.njk",
        "403page.njk",
        "404page.njk"
    ];
    var env = new nunjucks.Environment(new nunjucks.FileSystemLoader(viewsDir));
    addCustomFilters(env);
    for (template of templates) {
        let templateKey = String(template).split(".")[0];
        try {
            // views[templateKey] = nunjucks.render(template);
            views[templateKey] = env.getTemplate(template);
        } catch (error) {
            views[templateKey] = null;
        }
    }
    // views["404page"] = nunjucks.render("404page.njk");

    // console.log(env);
    // var tmpl = env.getTemplate("firstPageNoLog.njk");
    // console.log(nunjucks.render(tmpl));
}

function addCustomFilters(env) {
    env.addFilter("contains", (arr, item) => {
        if (!arr || !item) return false;
        if (typeof arr == typeof item) return arr == item;
        for (el of arr) {
            if (el == item) return true;
        }
        return false;
    });
}

function sendView(statusCode, response, viewName, data = {}) {
    if (views[viewName] == null) {
        send(404, response);
        return;
    }
    response.writeHead(statusCode, { "Content-type": "text/html" }); // 200 OK
    response.write(nunjucks.render(views[viewName], { data: data }));
    response.end();
}

function send(statusCode, response) {
    if (statusCode == null) {
        response.writeHead(400); // 400 Bad Request
        response.end();
        return;
    }

    switch (statusCode) {
        case 403:
            response.writeHead(statusCode); // 403 Forbidden
            response.write(nunjucks.render(views["403page"]));
            response.end();
            break;
        case 404:
            response.writeHead(statusCode); // 404 Not Found
            response.write(nunjucks.render(views["404page"]));
            response.end();
            break;
        case 405:
            response.writeHead(statusCode); // 405 Method Not Allowed
            response.write("Method Not Allowed");
            response.end();
            break;
        case 415:
            response.writeHead(statusCode); // 415 Unsupported Media Type
            response.write("Unsupported Media Type");
            response.end();
            break;
        case 500:
            response.writeHead(statusCode); // 500 Internal Server Error
            response.write("Internal Server Error");
            response.end();
            break;
        default:
            response.writeHead(400); // 400 Bad Request
            response.end();
    }
}

init(); // run once
module.exports = { viewsDir, sendView, send };
