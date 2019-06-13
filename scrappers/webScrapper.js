const scrapperModules = [require("./bestjobs"), require("./ejobs"), require("./meetup")];

function start() {
	// const interval = 1000 * 60 * 60 * 1;
	// const interval = 1000 * 2;
	// setInterval(() => {
	// 	// console.log("Tick");
	// 	scrapperModules.forEach(el => {
	// 		el.run();
	// 	});
	// }, interval);

	//debug! delete me!
	scrapperModules.forEach(el => {
		// el.run();
	});
}

module.exports = { start };
