const filesys = require("fs");
const util = require("util");
// const uuid = require('uuid');
const moment = require("moment");

const logFile = "./devlogs/logData";
const delim = "=========================";

class debug {
    static logToFile(data) {
        try {
            filesys.appendFile(
                logFile,
                "\n\n" +
                    delim.repeat(4) +
                    "\n\n" +
                    moment().format("MMMM Do YYYY, h:mm:ss a") +
                    "\n\n" +
                    util.inspect(data || ""),
                err => {
                    if (err) throw err;
                }
            );
        } catch (error) {
            console.log(
                "Failed to log data:<\n" +
                    (data || "") +
                    "\n>to file: " +
                    logFile
            );
        }
    }
}

module.exports = debug;
