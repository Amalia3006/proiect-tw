const jwt = require("jsonwebtoken");
const moment = require("moment");
const { parse } = require("querystring");
const multiparty = require("multiparty");
const bcrypt = require("bcrypt");
const fs = require("fs");

const { sendView, send } = require("../views");
const mydb = require("../models/allModels");

const debug = require("../debug");

const accesTokenTimeLimit = {
    value: 1,
    unit: "d"
};
// const accesTokenTimeLimit = {
//     // debug! delete me!
//     value: 30,
//     unit: "m"
// };

//---------------------------
const userDBtest = {
    // debug! delete me!
    bogdan9898: {
        username: "bogdan9898",
        password: "parolaCriptata",
        email: "bogdan@gmail.com"
    },
    bogdan: {
        username: "bogdan",
        password: "parola2Criptata",
        email: "bogdan@gmail.com"
    }
};
//---------------------------

//todo: generate random secret ar server start up
const jwtSecret = "abcdefghijklmnopqrstuvwxyz";

function getUidFromPath(url, pos = 1) {
    const parts = String(url)
        .split("/")
        .filter(el => {
            return el.length > 0;
        });
    if (parts.length >= 2) {
        return parts[pos];
    } else {
        return null;
    }
}

function getTokenFromCookies(cookies) {
    let cookiesDict = {};
    String(cookies)
        .split("; ")
        .forEach(el => {
            const temp = el.split("=");
            cookiesDict[temp[0]] = temp[1];
        });
    // console.log(cookiesDict);
    if (cookiesDict.token == undefined) {
        return null;
    } else {
        return cookiesDict.token;
    }
}

class routesHandler {
    static homeDisconnected(request, response) {
        const viewName = "firstPageNoLog";
        if (request.method == "GET") {
            sendView(200, response, viewName);
        } else {
            send(405, response);
        }
    }

    static homeLoggedin(request, response) {
        const viewName = "firstPageLoggedin";
        if (request.method == "GET") {
            const uid = getUidFromPath(request.url);
            if (uid == null) {
                send(404, response);
                return;
            }
            const token = getTokenFromCookies(request.headers.cookie);
            if (token == null) {
                //todo: redirect to /login/
                send(403, response);
                return;
            }
            mydb.user.findOne({ username: uid }, (err, userInfo) => {
                if (err) {
                    send(500, response);
                    return;
                }

                if (!userInfo) {
                    send(404, response);
                    return;
                }

                jwt.verify(token, jwtSecret + userInfo.password, (err, userDataFromJWT) => {
                    if (err) {
                        console.log(err);
                        response.writeHead(302, {
                            Location: "/login"
                        }); // 302 Moved Temporarily
                        response.end();
                        return;
                    }

                    console.log(userDataFromJWT);

                    //todo: populate view with info from db
                    sendView(200, response, viewName, {
                        username: userDataFromJWT.user.username
                    });
                });
            });
        } else {
            send(405, response);
        }
    }

    static login(request, response) {
        const viewName = "pageSignIn";
        if (request.method == "GET") {
            sendView(200, response, viewName);
        } else if (request.method == "POST") {
            debug.logToFile(request);

            const contentType = String(request.headers["content-type"]);
            if (
                contentType.indexOf("application/json") == -1 &&
                contentType.indexOf("application/x-www-form-urlencoded") == -1
            ) {
                console.log("Reject contentType: " + contentType);
                send(415, response);
                return;
            }

            let body = [];
            request.on("data", chunk => {
                // console.log("ch: " + chunk);
                body.push(chunk);
            });
            request.on("end", () => {
                body = body.join();
                if (contentType.indexOf("application/x-www-form-urlencoded") != -1) {
                    body = parse(body);
                }
                // console.log(body);
                mydb.user.findOne({ username: body.user_name }, (err, userInfo) => {
                    if (err) {
                        body.error = "Server database error";
                        sendView(500, response, viewName, body);
                        return;
                    }
                    if (!userInfo) {
                        body.error = "Wrong username";
                        sendView(404, response, viewName, body);
                        return;
                    }
                    // console.log(userInfo);
                    bcrypt.compare(body.user_password, userInfo.password, (err, res) => {
                        if (err) {
                            body.error = "Server database error";
                            sendView(500, response, viewName, body);
                            return;
                        }
                        // console.log(res);
                        if (!res) {
                            body.error = "Wrong password";
                            sendView(400, response, viewName, body);
                            return;
                        }

                        jwt.sign(
                            { user: userInfo },
                            jwtSecret + userInfo.password,
                            {
                                expiresIn: accesTokenTimeLimit.value + accesTokenTimeLimit.unit
                            },
                            (err, token) => {
                                if (err) {
                                    console.log(err);
                                    send(500, response);
                                    return;
                                }
                                // console.log("token:" + token);
                                // response.writeHead(302, {
                                //     Location: "/home/" + body.user_name
                                // }); // 302 Moved Temporarily
                                // response.end();
                                const cookieExpDate = moment()
                                    .add(accesTokenTimeLimit.value, accesTokenTimeLimit.unit)
                                    .toDate()
                                    .toUTCString();
                                // console.log("token expDate: " + cookieExpDate);
                                response.writeHead(302, {
                                    Location: "/home/" + body.user_name,
                                    "Set-Cookie":
                                        "token=" + token + "; path=/; expires=" + cookieExpDate + "; HttpOnly;"
                                }); // 302 Moved Temporarily
                                response.end();
                            }
                        );
                    });
                });
            });
        } else {
            send(405, response);
        }
    }

    static register(request, response) {
        // todo: check password min length
        // other checks
        const viewName = "pageSignUp";
        if (request.method == "GET") {
            sendView(200, response, viewName);
        } else if (request.method == "POST") {
            let body = [];
            request.on("data", chunk => {
                // console.log("ch: " + chunk);
                body.push(chunk);
            });
            request.on("end", () => {
                body = body.join();
                // console.log(body);
                body = parse(body);
                // console.log(body);
                // body is ready

                // check if passwords match
                if (body.user_password[0] != body.user_password[1]) {
                    // passwords dont match
                    body.error = "Passwords don't match";
                    sendView(400, response, viewName, body);
                    return;
                }

                // checking if username already exists
                mydb.user.findOne({ username: body.user_name[2] }, (err, result) => {
                    if (err) {
                        console.log(err);
                        body.error = "Server database error";
                        sendView(500, response, viewName, body);
                        return;
                    }

                    if (result) {
                        // username already exists
                        body.error = "Username already exists";
                        sendView(400, response, viewName, body);
                        return;
                    }
                    bcrypt.hash(body.user_password[0], 10, (err, hashedPassword) => {
                        if (err) {
                            console.log(err);
                            body.error = "Server database error";
                            sendView(500, response, viewName, body);
                            return;
                        }

                        const newUser = new mydb.user({
                            fname: body.user_name[0],
                            lname: body.user_name[1],
                            username: body.user_name[2],
                            country: body.user_country,
                            city: body.user_city,
                            email: body.user_email,
                            tel: body.user_tel,
                            gender: body.user_gender,
                            password: hashedPassword,
                            bio: body.user_bio,
                            profession: body.user_profession,
                            company: body.user_company,
                            jobRole: body.user_job_role,
                            interests: body.user_interest,
                            languages: body.language,
                            linkedin: body.linkedin_user_url,
                            github: body.github_user_url
                        });

                        // console.log(newUser);

                        newUser.save(err => {
                            if (err) {
                                console.log(err);
                                body.error = "Server database error";
                                sendView(500, response, viewName, body);
                                return;
                            }

                            console.log("User " + newUser.username + " saved to database");

                            response.writeHead(302, {
                                Location: "/login"
                            }); // 302 Moved Temporarily
                            response.end();
                        });
                    });
                });
            });
        } else {
            send(405, response);
        }
    }

    static logout(request, response) {
        if (request.method == "GET") {
            response.writeHead(302, {
                Location: "/",
                "Set-Cookie": "token=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
            }); // 302 Moved Temporarily
            response.end();
        } else {
            send(405, response);
        }
    }

    static profile(request, response) {
        const viewName = "pageProfile";
        if (request.method == "GET") {
            const uid = getUidFromPath(request.url);
            if (uid == null) {
                send(400, response);
                return;
            }
            const token = getTokenFromCookies(request.headers.cookie);
            if (token == null) {
                //todo: redirect to /login/
                send(403, response);
                return;
            }
            mydb.user.findOne({ username: uid }, (err, userinfo) => {
                if (err) {
                    send(500, response);
                    console.log(err);
                    return;
                }

                if (!userinfo) {
                    send(404, response);
                    // console.log("User invalid");
                    return;
                }

                jwt.verify(token, jwtSecret + userinfo.password, (err, userDataFromJWT) => {
                    if (err) {
                        console.log(err);
                        response.writeHead(302, {
                            Location: "/login"
                        }); // 302 Moved Temporarily
                        response.end();
                        return;
                    }

                    sendView(200, response, viewName, userinfo);
                });
            });
        } else {
            send(405, response);
        }
    }

    static jobs(request, response) {
        const viewName = "pageJobs";
        if (request.method == "GET") {
            const uid = getUidFromPath(request.url);
            if (uid == null) {
                //send general jobs page
                sendView(200, response, viewName);
                return;
            }
            const token = getTokenFromCookies(request.headers.cookie);
            if (token == null) {
                //todo: redirect to /login/
                send(403, response);
                return;
            }
            mydb.user.findOne({ username: uid }, (err, userInfo) => {
                if (err) {
                    send(500, response);
                    return;
                }

                if (!userInfo) {
                    send(404, response);
                    return;
                }

                jwt.verify(token, jwtSecret + userInfo.password, (err, userDataFromJWT) => {
                    if (err) {
                        console.log(err);
                        response.writeHead(302, {
                            Location: "/login"
                        }); // 302 Moved Temporarily
                        response.end();
                        return;
                    }

                    // console.log(userDataFromJWT);

					mydb.job.find({}, (err, jobsInfo) => {
						if(err){
							console.log(err);
							send(500, response);
							return;
						}
						if(!jobsInfo) {
							console.log("No job found");
							send(404, response);
							return;
						}

						jobsInfo.splice(6);
						sendView(200, response, viewName, {
							username: userDataFromJWT.user.username,
							jobsInfo: jobsInfo
						});
					})
                });
            });
        } else {
            send(405, response);
        }
    }

    static events(request, response) {
        const viewName = "pageOportunity";
        if (request.method == "GET") {
            const uid = getUidFromPath(request.url);
            if (uid == null) {
                //send general events page
                sendView(200, response, viewName);
                return;
            }
            const token = getTokenFromCookies(request.headers.cookie);
            if (token == null) {
                //redirect to /login
                response.writeHead(302, {
                    Location: "/login"
                }); // 302 Moved Temporarily
                response.end();
                return;
            }
            mydb.user.findOne({ username: uid }, (err, userInfo) => {
                if (err) {
                    send(500, response);
                    return;
                }

                if (!userInfo) {
                    send(404, response);
                    return;
                }

                jwt.verify(token, jwtSecret + userInfo.password, (err, userDataFromJWT) => {
                    if (err) {
                        console.log(err);
                        response.writeHead(302, {
                            Location: "/login"
                        }); // 302 Moved Temporarily
                        response.end();
                        return;
                    }

                    // console.log(userDataFromJWT);

					mydb.event.find({}, (err, eventsInfo) => {
						if(err) {
							console.log(err);
							send(500, response);
							return;
						}
						if(!eventsInfo) {
							console.log("No event found");
							send(404, response);
							return;
						}

						eventsInfo.splice(33);
						sendView(200, response, viewName, {
							username: userDataFromJWT.user.username,
							eventsInfo: eventsInfo
						});
					})
                });
            });
        } else {
            send(405, response);
        }
    }

    static image(request, response) {
        if (request.method == "GET") {
            //todo trimite imaginea din baza de date
            const uid = getUidFromPath(request.url);
            if (uid == null) {
                send(400, response);
                return;
            }
            const token = getTokenFromCookies(request.headers.cookie);
            if (token == null) {
                send(403, response);
                return;
            }
            mydb.user.findOne({ username: uid }, (err, userInfo) => {
                if (err) {
                    console.log(err);
                    send(500, response);
                    return;
                }

                if (userInfo == null) {
                    console.log("user not found: " + uid);
                    send(404, response);
                    return;
                }

                jwt.verify(token, jwtSecret + userInfo.password, (err, userDataFromJWT) => {
                    if (err) {
                        console.log(err);
                        response.writeHead(302, {
                            Location: "/login"
                        }); // 302 Moved Temporarily
                        response.end();
                        return;
                    }

                    mydb.img.findOne({ id: uid }, (err, imgInfo) => {
                        if (err) {
                            console.log(err);
                            send(500, response);
                            return;
                        }

                        if (imgInfo == null) {
                            console.log("no info img for user: " + uid);
                            send(404, response);
                            return;
                        }

                        response.writeHead(200, {
                            "Content-type": "image/*"
                        }); // 200 OK
                        response.write(imgInfo.data);
                        response.end();
                    });
                });
            });
            return;
        } else if (request.method == "POST") {
            const uid = getUidFromPath(request.url);
            if (uid == null) {
                send(400, response);
                return;
            }
            const token = getTokenFromCookies(request.headers.cookie);
            if (token == null) {
                send(403, response);
                return;
            }
            mydb.user.findOne({ username: uid }, (err, userInfo) => {
                if (err) {
                    send(500, response);
                    return;
                }

                if (!userInfo) {
                    send(404, response);
                    return;
                }

                jwt.verify(token, jwtSecret + userInfo.password, (err, userDataFromJWT) => {
                    if (err) {
                        console.log(err);
                        response.writeHead(302, {
                            Location: "/login"
                        }); // 302 Moved Temporarily
                        response.end();
                        return;
                    }

                    let form = new multiparty.Form();
                    form.parse(request, (err, fields, files) => {
                        if (err) {
                            console.log(err);
                            send(500, response);
                            return;
                        }
                        // console.log("form.parse");
                        // console.log(util.inspect(fields));
                        // console.log(files.profileImg);

                        // multiparty creates temp files on disk
                        // read files from disk and upload to db
                        fs.readFile(files.profileImg[0].path, (err, data) => {
                            if (err) {
                                send(404, response);
                                return;
                            }

                            mydb.img.findOne({ id: uid }, (err, imageInfo) => {
                                if (err) {
                                    console.log(err);
                                    send(500, response);
                                    return;
                                }

                                if (!imageInfo) {
                                    imageInfo = new mydb.img({
                                        id: uid,
                                        filename: files.profileImg[0].originalFilename,
                                        data: data
                                    });
                                } else {
                                    imageInfo.filename = files.profileImg[0].originalFilename;
                                    imageInfo.data = data;
                                }

                                imageInfo.save(err => {
                                    if (err) {
                                        console.log(err);
                                        send(500, response);
                                        return;
                                    }
                                    console.log("Profile image updated for: " + uid);

                                    response.writeHead(302, {
                                        Location: "/profile/" + uid
                                    }); // 302 Moved Temporarily
                                    response.end();
                                });
                            });
                        });
                    });
                });
            });
        } else {
            send(405, response);
        }
    }

    static imageResource(request, response) {
        if (request.method == "GET") {
			let uid = getUidFromPath(decodeURI(request.url));
            if (uid == null) {
                //send general events page
                sendView(200, response, viewName);
                return;
            }
            mydb.img.findOne({ id: uid }, (err, imgInfo) => {
                if (err) {
                    console.log(err);
                    send(500, response);
                    return;
                }

                if (!imgInfo) {
                    send(404, response);
                    return;
                }

                response.writeHead(200, {
                    "Content-type": "image/*"
                }); // 200 OK
                response.write(imgInfo.data);
                response.end();
            });
        } else if (request.method == "POST") {
            send(404, response);
        } else {
            send(405, response);
        }
    }
}

module.exports = routesHandler;
