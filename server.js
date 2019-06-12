/*todo:
    1. databse
    2. templateuri
    3. routes: 
        3.1 resources("text/css", "image/webp", js scripts)
        3.2 /api/
    4. preluarea joburilor si oportunitatilor de pe diverse siteuri: bestjobs, junio etc
    5. crearea de conturi:
        5.1 preluarea de date de pe github, linkedIn etc
        5.2 locatia: din browser, ip tracker, locatia ultimului job etc
    6. recomandari
    7. evolutia utilizatorului
    8. editat profil
    9. pagina forgot password
*/
const http = require("http");
const mongoose = require("mongoose");


const handleRequest = require("./requestHandler");
const uploadToDb = require("./uploadToDB__debugging__"); // debug! delete me! //read file for more info
const webScrapper = require("./scrappers/webScrapper");

webScrapper.start();

mongoose.connect("mongodb://localhost:27017/teask", { useNewUrlParser: true, useCreateIndex: true }, err => {
	if (err) {
		console.log(err);
		return;
	}
	console.log("MongoDB connected");
	// uploadToDb.doYourThing(); // debug! delete me!
});

const port = 3000;
http.createServer(handleRequest).listen(port);
console.log("Server listening on port " + port);
