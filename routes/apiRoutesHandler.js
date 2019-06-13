const mydb = require("../models/allModels");
const bcrypt = require("bcrypt");
const jwtSecret = "abcdefghijklmnopqrstuvwxyz";
const jwt = require("jsonwebtoken");
const moment = require("moment");
const accesTokenTimeLimit = {
  value: 1,
  unit: "d"
};

function send(statusCode, response) {
  if (statusCode == null) {
    response.writeHead(400); // 400 Bad Request
    response.write(JSON.stringify({ error: "400 Bad Request" }));
    response.end();
    return;
  }

  switch (statusCode) {
    case 403:
      response.writeHead(statusCode); // 403 Forbidden
      response.write(JSON.stringify({ error: "403 Forbidden" }));
      response.end();
      break;
    case 404:
      response.writeHead(statusCode); // 404 Not Found
      response.write(JSON.stringify({ error: "404 Not Found" }));
      response.end();
      break;
    case 405:
      response.writeHead(statusCode); // 405 Method Not Allowed
      response.write(JSON.stringify({ error: "Method Not Allowed" }));
      response.end();
      break;
    case 415:
      response.writeHead(statusCode); // 415 Unsupported Media Type
      response.write(JSON.stringify({ error: "Unsupported Media Type" }));
      response.end();
      break;
    case 500:
      response.writeHead(statusCode); // 500 Internal Server Error
      response.write(JSON.stringify({ error: "Internal Server Error" }));
      response.end();
      break;
    default:
      response.writeHead(400); // 400 Bad
      response.write(JSON.stringify({ error: "400 Bad request" }));
      response.end();
  }
}

class apiRoutesHandler {
  static login(request, response) {
    if (request.method == "POST") {
      const accept = String(request.headers["accept"]);
      const contentType = String(request.headers["content-type"]);
      if (
        accept.indexOf("application/json") == -1 &&
        contentType.indexOf("application/json") == -1
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
        body = JSON.parse(body);
        mydb.user.findOne({ username: body.username }, (err, userInfo) => {
          if (err) {
            body.error = "Server database error";
            send(500, response);
            return;
          }
          if (!userInfo) {
            body.error = "Wrong username";
            send(404, response);
            return;
          }
          bcrypt.compare(body.password, userInfo.password, (err, res) => {
            if (err) {
              body.error = "Server database error";
              send(500, response);
              return;
            }
            // console.log(res);
            if (!res) {
              body.error = "Wrong password";
              send(400, response);
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

                response.writeHead(201, {
                  "Content-type": "application/json"
                });
                response.write(
                  JSON.stringify({
                    uid: userInfo.username,
                    token: token,
                    expiresIn: cookieExpDate
                  })
                );
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
    if (request.method == "POST") {
      let body = [];
      request.on("data", chunk => {
        // console.log("ch: " + chunk);
        body.push(chunk);
      });
      request.on("end", () => {
        body = body.join();
        // console.log(body);
        body = JSON.parse(body);
        // console.log(body);
        // body is ready

        // check if passwords match
        if (body.user_password[0] != body.user_password[1]) {
          // passwords dont match
          body.error = "Passwords don't match";
          send(400, response);
          return;
        }

        // checking if username already exists
        mydb.user.findOne({ username: body.user_name[2] }, (err, result) => {
          if (err) {
            console.log(err);
            body.error = "Server database error";
            send(500, response);
            return;
          }

          if (result) {
            // username already exists
            body.error = "Username already exists";
            send(400, response);
            return;
          }
          bcrypt.hash(body.user_password[0], 10, (err, hashedPassword) => {
            if (err) {
              console.log(err);
              body.error = "Server database error";
              send(500, response);
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
                send(500, response);
                return;
              }

              console.log("User " + newUser.username + " saved to database");

              response.writeHead(201, {
                "Content-type": "application/json"
              });
              response.write(
                JSON.stringify({
                  raspuns:
                    "Userul " +
                    newUser.username +
                    " a fost inregistrat cu succes!"
                })
              );
              response.end();
            });
          });
        });
      });
    } else {
      send(405, response);
    }
  }

  static profile(request, response) {
    if (request.method == "GET") {
      let body = [];
      request.on("data", chunk => {
        // console.log("ch: " + chunk);
        body.push(chunk);
      });

      request.on("end", () => {
        body = body.join();
        // console.log(body);
        body = JSON.parse(body);
        // console.log(body);
        // body is ready
        const uid = body.uid;
        if (uid == null) {
          send(400, response);
          return;
        }
        const token = body.token;
        if (token == null) {
          send(403, response);
          return;
        }

        mydb.user.findOne({ username: uid }, (err, userInfo) => {
          if (err) {
            send(500, response);
            console.log(err);
            return;
          }

          if (!userInfo) {
            send(404, response);
            // console.log("User invalid");
            return;
          }

          jwt.verify(
            token,
            jwtSecret + userInfo.password,
            (err, userDataFromJWT) => {
              if (err) {
                console.log(err);
                send(400, response);
                return;
              }
              response.writeHead(200, {
                "Content-type": "application/json"
              });

              response.write(JSON.stringify(userInfo));
              response.end();
            }
          );
        });
      });
    } else {
      send(405, response);
    }
  }

  static jobs(request, response) {
    if (request.method == "GET") {
      let body = [];
      request.on("data", chunk => {
        // console.log("ch: " + chunk);
        body.push(chunk);
      });

      request.on("end", () => {
        if (!body) {
          send(404, response);
          return;
        }
        body = body.join();
        // console.log(body);
        if (String(body).length == 0) {
          mydb.job.find({}, (err, jobsInfo) => {
            if (err) {
              console.log(err);
              send(500, response);
              return;
            }
            if (!jobsInfo) {
              console.log("No job found");
              send(404, response);
              return;
            }
            response.writeHead(200, { "Content-type": "application/json" });
            response.write(JSON.stringify(jobsInfo));
            response.end();
          });
          return;
        }
        body = JSON.parse(body);
        // console.log(body);
        // body is ready
        const uid = body.uid;
        if (uid == null) {
          mydb.job.find({}, (err, jobInfo) => {
            response.writeHead(200, { "Content-type": "application/json" });
            response.write(json.stringify(jobInfo));
            response.end();
          });
          return;
        }
        const token = body.token;
        if (token == null) {
          send(403, response);
          return;
        }

        mydb.user.findOne({ username: uid }, (err, userInfo) => {
          if (err) {
            send(500, response);
            console.log(err);
            return;
          }

          if (!userInfo) {
            send(404, response);
            // console.log("User invalid");
            return;
          }

          jwt.verify(
            token,
            jwtSecret + userInfo.password,
            (err, userDataFromJWT) => {
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
                if (err) {
                  console.log(err);
                  send(500, response);
                  return;
                }
                if (!jobsInfo) {
                  console.log("No job found");
                  send(404, response);
                  return;
                }

                jobsInfo.splice(33);
                response.writeHead(200, { "Content-type": "application/json" });
                response.write(json.stringify(jobInfo));
                response.end();
              });
            }
          );
        });
      });
    }
  }

  static events(request, response) {
    if (request.method == "GET") {
      let body = [];
      request.on("data", chunk => {
        // console.log("ch: " + chunk);
        body.push(chunk);
      });

      request.on("end", () => {
        if (!body) {
          send(404, response);
          return;
        }
        body = body.join();
        // console.log(body);
        if (String(body).length == 0) {
          mydb.job.find({}, (err, eventsInfo) => {
            if (err) {
              console.log(err);
              send(500, response);
              return;
            }
            if (!eventsInfo) {
              console.log("No job found");
              send(404, response);
              return;
            }
            response.writeHead(200, { "Content-type": "application/json" });
            response.write(JSON.stringify(eventsInfo));
            response.end();
          });
          return;
        }
        body = JSON.parse(body);
        // console.log(body);
        // body is ready
        const uid = body.uid;
        if (uid == null) {
          mydb.event.find({}, (err, eventsInfo) => {
            response.writeHead(200, { "Content-type": "application/json" });
            response.write(json.stringify(eventsInfo));
            response.end();
          });
          return;
        }
        const token = body.token;
        if (token == null) {
          send(403, response);
          return;
        }

        mydb.user.findOne({ username: uid }, (err, userInfo) => {
          if (err) {
            send(500, response);
            console.log(err);
            return;
          }

          if (!userInfo) {
            send(404, response);
            // console.log("User invalid");
            return;
          }

          jwt.verify(
            token,
            jwtSecret + userInfo.password,
            (err, userDataFromJWT) => {
              if (err) {
                console.log(err);
                response.writeHead(302, {
                  Location: "/login"
                }); // 302 Moved Temporarily
                response.end();
                return;
              }

              // console.log(userDataFromJWT);

              mydb.job.find({}, (err, eventsInfo) => {
                if (err) {
                  console.log(err);
                  send(500, response);
                  return;
                }
                if (!eventsInfo) {
                  console.log("No job found");
                  send(404, response);
                  return;
                }

                eventsInfo.splice(33);
                response.writeHead(200, { "Content-type": "application/json" });
                response.write(json.stringify(eventsInfo));
                response.end();
              });
            }
          );
        });
      });
    }
  }
}
module.exports = apiRoutesHandler;
