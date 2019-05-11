const filesys = require("fs");
const urlParse = require("url-parse");
const ulrResolve = require("url").resolve;

const debug = require("./debug");
const { viewsDir, send } = require("./views");
const { routes, apiRoutes } = require("./routes/routes");

//------
// const accepedContentTypes = [ "text/html", "text/css", "image/webp", "*/*" ];
//------

function handleRequest(request, response) {
    request.on("error", err => {
        console.log(err);
    });
    response.on("error", err => {
        console.log(err);
    });

    debug.logToFile(
        "Request: " +
            JSON.stringify(
                request.method + " " + request.headers.host + request.url
            )
    );

    let path = urlParse(request.url).pathname;
    let contentType = String(request.headers.accept).split(",")[0];
    // console.log(path + " ~_~ " + contentType);

    if (path.startsWith("/api/")) {
        apiRoutes(request, response);
    } else if(path.startsWith("/image")){// debug!
        routes(request, response);
    } else if (contentType == "text/html") {
        routes(request, response);
    } else {
        if (request.method.match(/^get$/i)) {
            path = viewsDir + path;
            console.log("resource: " + path);
            filesys.readFile(path, null, (err, data) => {
                if (err) {
                    console.log(err);
                    send(404, response);
                    return;
                }
                response.writeHead(200, { "Content-type": contentType }); // 200 OK
                response.write(data);
                response.end();
            });
        } else {
            send(405, response);
        }
    }
}

module.exports = handleRequest;
