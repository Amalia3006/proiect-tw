const http = require('http');
const filesys = require('fs');
const util = require('util');
const url = require('url-parse');
const uuid = require('uuid');

//------
const { init, views, viewDir } = require("./pageManager");
init();
// console.log(views);
//------
const homeView = "firstPageNoLog";

// const accepedFileTypes = [ "text/html", "text/css", "image/webp" ];

const port = 3000;
http.createServer(handleRequest).listen(port);

function handleRequest(request, response) {
    // console.log("Request: " + util.inspect(request['headers']['host']) + util.inspect(request['url']));
    console.log("Request: " + JSON.stringify(request['headers']['host'] + request['url']));

    // console.log(request['url']);
    //response.write("hello");

    let file = String(request['url']);
    let fileType = String(request['headers']['accept']).split(",")[0];
    // console.log(file + " ### " + fileType);

    if(file == "/") {
        file = homeView;
    }
    // console.log("--->\n" + file + "\n<---");
    // console.log(views[homeView]);

    if(fileType == "text/html") {
        if(file.indexOf(".html") >= 0) {
            file = file.split(".html")[0];
        }
        if(file[0] == '/') {
            file = file.substr(1);
        }
        if(views[file] == undefined || views[file] == null) {
            send404(response);
            return;
        }
        response.writeHead(200, {"Content-type": fileType});
        response.write(views[file]);
        response.end();
        return;
    }

    file = viewDir + file;
    // console.log(file);
    try {
        filesys.readFile(file, null, (err, data) => {
            if(err) {
                send404(response);
                return;
            }
            response.writeHead(200, {"Content-type": fileType});
            response.write(data);
            response.end();
        });
    } catch (error) {
        send404(response);
        return;
    }
}

function send404(response) {
    response.writeHead(404);
    response.write(views["404page"]);
    response.end();
}

function log(data) {
    filesys.writeFile('./devlogs/log' + uuid(), util.inspect(data), (err) => {
        if (err) throw err;
    });
}

