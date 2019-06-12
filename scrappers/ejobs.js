const { XMLHttpRequest } = require("xmlhttprequest");
const cheerio = require("cheerio");
const mydb = require("../models/allModels");

function run() {
	// console.log("Ejobs scrapper");
	let xhr = new XMLHttpRequest();
	xhr.open("GET", "https://www.ejobs.ro/locuri-de-munca/it-software/it---telecom/", true);
	xhr.responseType = "text/html";
	xhr.onload = e => {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {
				const document = cheerio.load(xhr.responseText);
				document("#job-app-list")
					.children("li[class!='jobitem jobitem-banner listview']")
					.each((i, el) => {
						const jobBody = document(el)
							.children(".jobitem-inner")
							.children(".jobitem-body");
						const jobTitle = jobBody.children(".jobitem-title").text();
						const jobDate = jobBody
							.children(".jobitem-date")
							.children("span:nth-child(1)")
							.text();
						const jobLocation = jobBody.children(".jobitem-location").text();
						const jobLink = jobBody
							.children(".jobitem-title")
							.children(".title")
							.attr("href");
						let jobDesc = jobBody.children("p[class='jobitem-desc hidden-gridview']").text();
						jobDesc = jobDesc.length == 0 ? "Confidential" : jobDesc;
						const jobLogo = jobBody
							.parent()
							.children(".jobitem-logo")
							.children(".elogo")
							.children(".elogo__inner")
							.children("a")
							.children("img")
							.attr("data-src");
						const jobCompany = jobBody
							.children(".jobitem-company")
							.children("a")
							.children("span")
							.text();
						// if (i < 3) {
						// 	console.log("\n" + i);
						// 	console.log(jobTitle);
						// 	console.log(jobDate);
						// 	console.log(jobLocation);
						// 	console.log(jobLink);
						// 	console.log(jobDesc);
						// 	console.log(jobLogo);
						// 	console.log(jobCompany);
						// }
						mydb.job.findOne({ title: jobTitle }, (err, jobInfo) => {
							if (err) {
								console.log(err);
								return;
							}

							if (jobInfo) {
								jobInfo.type = jobCompany;
								jobInfo.country = jobLocation;
								jobInfo.description = jobDesc;
								jobInfo.logo = jobLogo;
								jobInfo.website = jobLink;
								jobInfo.date = Date.now();
							} else {
								jobInfo = new mydb.job({
									title: jobTitle,
									type: jobCompany,
									country: jobLocation,
									description: jobDesc,
									logo: jobLogo,
									website: jobLink,
									date: Date.now()
								});
							}

							jobInfo.save(err => {
								if (err) {
									console.log(err);
									return;
								}
							});
						});
					});
			} else {
				console.log("XMLHttpRequest error: status code: " + xhr.status);
			}
		}
	};
	xhr.onerror = err => {
		console.log(err);
	};
	xhr.send();
}

module.exports = { run };
