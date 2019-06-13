/*
const routes = {
    "GET /": "firstPageNoLog",
    "GET /home/:uid": "firstPageLoggedin",
    "GET /login": "pageSignIn",
    "GET /signin": "pageSignIn",
    "GET /register": "pageSignUp",
    "GET /signup": "pageSignUp",
    "GET /logout": "delete acces token and redrect to /",
    "GET /signout": "delete acces token and redirect to /",
    "GET /profile/:uid": "pageProfile",
    "GET /jobs/:uid": "pageJobs",
    "GET /jobs": "pageJobs-paginaGenerala",
    "GET /events/:uid": "pageOportunity"
    "GET /events": "pageOportunity-paginaGenerala",
    "GET /image/:iid": send image with iid from db,
    "POST /image/:iid": post a image with iid on db,
    // "POST /register": "register user and redirect to /home/:uid",
    // "POST /signin": "register user and redirect to /home/:uid",
    // "POST /login": "login user and redirect to /home/:uid",
    // "POST /register": "login user and redirect to /home/:uid"
};
//todo: api requests !MUST! have a json body
const apiRoutes = {
    "GET /api/login": "login user, return /:uid, accesToken",
    "POST/PUT /api/register": "register user, return true/false",
    "POST/PUT /api/logout": "logout user, return true/false",
    "GET/POST /api/profile": "return profile json or modify it",
    "GET /api/jobs": "return jobs json",
    "GET /api/events": "return events json"
};
*/
const urlParse = require("url-parse");

const { send } = require("../views");
const routesHandler = require("./routesHandler");
const apiRoutesHandler = require("./apiRoutesHandler");

const routesMapping = [
	[/^\/*$/i, routesHandler.homeDisconnected],
	[/^\/home\/[A-Za-z0-9]+\/*$/i, routesHandler.homeLoggedin],
	// [/^\/home\/[A-Za-z0-9]+\/?$/i, routesHandler.homeDisconnected], // debug! delete me!
	[/^\/login\/*$/i, routesHandler.login],
	[/^\/signin\/*$/i, routesHandler.login],
	[/^\/register\/*$/i, routesHandler.register],
	[/^\/signup\/*$/i, routesHandler.register],
	[/^\/logout\/*$/i, routesHandler.logout],
	[/^\/signout\/*$/i, routesHandler.logout],
	[/^\/profile\/[A-Za-z0-9]+\/*$/i, routesHandler.profile],
	[/^\/jobs(\/[A-Za-z0-9]+)?\/*$/i, routesHandler.jobs],
	[/^\/events(\/[A-Za-z0-9]+)?\/*$/i, routesHandler.events],
	[/^\/image\/[A-Za-z0-9]+\/*$/i, routesHandler.image],
	[/^\/image\/__[A-Za-z0-9%&@\-]+\/*$/i, routesHandler.imageResource],
	[/^\/search(\/[A-Za-z0-9]+)?\/*$/i, routesHandler.search]
];

function routes(request, response) {
	const path = urlParse(request.url).pathname;
	console.log("routes: " + request.method + " " + path);

	for (item of routesMapping) {
		// console.log("regex match: " + path + " @ " + item[0] + " => " + path.match(item[0]));
		if (path.match(item[0])) {
			item[1](request, response);
			return;
		}
	}

	send(404, response);
}

const apiRoutesMapping = [
	[/^\/api\/login\/?$/i, apiRoutesHandler.login],
	[/^\/api\/register\/?$/i, apiRoutesHandler.register],
	[/^\/api\/profile\/?$/i, apiRoutesHandler.profile],
	[/^\/api\/jobs\/?$/i, apiRoutesHandler.jobs],
	[/^\/api\/events\/?$/i, apiRoutesHandler.events]
];

function apiRoutes(request, response) {
	const path = urlParse(request.url).pathname;
	console.log("apiRoutes: " + request.method + " " + path);

	for (item of apiRoutesMapping) {
		// console.log("regex match: " + path + " @ " + item[0] + " => " + path.match(item[0]));
		if (path.match(item[0])) {
			item[1](request, response);
			return;
		}
	}

	send(404, response);
}

module.exports = { routes, apiRoutes };
