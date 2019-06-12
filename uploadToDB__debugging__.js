//debug! delete me!
// this file is only for debugging purposes!
const fs = require("fs");
const mydb = require("./models/allModels");

function uploadImages() {
	console.log("Uploading images to db...");

	const files = [
		"./views/resources/firme/amazon.png",
		"./views/resources/firme/Bit.png",
		"./views/resources/firme/cgm.png",
		"./views/resources/firme/Conti.png",
		"./views/resources/firme/veoneer.png",
		"./views/resources/firme/Yonder.png",
		"./views/resources/logoFirma/BeeNear.png",
		"./views/resources/logoFirma/UI-UX & Frontend @Centric.png",
		"./views/resources/logoFirma/Codecamp.png",
		"./views/resources/logoFirma/Conduent.png",
		"./views/resources/logoFirma/Continental.png",
		"./views/resources/logoFirma/FII Practic.jpg",
		"./views/resources/logoFirma/IT Arena.png",
		"./views/resources/logoFirma/Microsoft Ignite.png",
		"./views/resources/logoFirma/World Summit AI.jpg"
	];

	files.forEach((file, index) => {
		fs.readFile(file, (err, data) => {
			// console.log("for each: " + file + " " + index);
			if (err) {
				console.log(err);
				return;
			}
			const fileSplitPath = String(file).split("/");
			const filenameWithExt = fileSplitPath[fileSplitPath.length - 1];
			const filenameWithoutExt = filenameWithExt.split(".")[0];
			const prefix = "__";
			mydb.img.findOne({ id: prefix + filenameWithoutExt }, (err, imageInfo) => {
				if (err) {
					console.log(err);
					return;
				}

				// console.log(imageInfo);

				if (!imageInfo) {
					imageInfo = new mydb.img({
						id: prefix + filenameWithoutExt,
						filename: filenameWithExt,
						data: data
					});
				} else {
					imageInfo.filename = filenameWithExt;
					imageInfo.data = data;
				}

				imageInfo.save(err => {
					if (err) {
						console.log(err);
						return;
					}
				});
			});
		});
	});
}

function uploadEvents() {
	const events = [
		{
			title: "Codecamp",
			// date: "6 Aprilie",
			date: new Date(2019, 4, 6),
			country: "Romania",
			city: "Iasi",
			description:
				"Codecamp is the first nation-wide IT Conference in Romania, and most likely, the biggest one. In the 12 years since starting, Codecamp created an amazing community around them, bringing together companies, startups and IT professionals.",
			website: "https://codecamp.ro/",
			tags: [
				"JavaScript",
				"Python",
				"Java",
				"C/C++",
				"PHP",
				"Swift",
				"Ruby",
				"Objective-C",
				"C#",
				"Programmer",
				"Web Developer"
			],
			type: "training",
			expRequired: "mid_level",
			logo: "https://i.ibb.co/xYFrJNG/Codecamp.png"
		},
		{
			title: "FII Practic",
			// date: "9 MARTIE - 31 MARTIE",
			date: new Date(2019, 3, 9),
			country: "Romania",
			city: "Iasi",
			description:
				"Cele 4 săptămâni de traininguri de la Iaşi se vor desfășura în weekend-urile din perioada 9 martie 2019 – 31 martie 2019 în incinta Facultăţii de Informatică (Corpul C al Universitaţii „Alexandru Ioan Cuza”)",
			website: "https://fiipractic.asii.ro/",
			tags: ["JavaScript", "Java", "C/C++", "PHP", "C#", "Web Developer", "Programmer", "Python"],
			type: "training",
			expRequired: "no_experience",
			logo: "https://i.ibb.co/B6P5MJ5/FII-Practic.jpg"
		},
		{
			title: "UI-UX & Frontend @Centric",
			// date: "March 23",
			date: new Date(2019, 3, 23),
			country: "Romania",
			city: "Iasi",
			description:
				"This training is made for students that are interested in design and don’t have any prior knowledge. It is the best place to get a guided introduction into the world of digital design, find out what the basic principles of design are, and how you can apply them. You’ll also get to see how we apply design in Centric and what does it mean to be a designer in a big company.",
			website: "https://www.centric.eu/RO/Default",
			tags: [
				"SQL",
				"Java",
				"C/C++",
				"JavaScript",
				"PHP",
				"Programmer",
				"Web Developer",
				"Computer Systems Analyst"
			],
			type: "internship",
			expRequired: "entry_level",
			logo: "https://i.ibb.co/2jLB1CD/UI-UX-Frontend-Centric.jpg"
		},
		{
			title: "Microsoft Ignite",
			// date: "November 4-8",
			date: new Date(2019, 11, 4),
			country: "USA",
			city: "Orlando, Florida",
			description:
				"Microsoft Ignite is Microsoft’s annual meeting designed for enterprise professionals, services, and products. Microsoft Ignite offers over 700 different sessions that cover topics like deployment, development, architecture, implementation & migration, security, access management & compliance, usage & adoption, and operations & management. The conference provides advanced technical training for attendees, as well as plenty of opportunities for networking and sharing the latest ideas. It also offers demos on more than 150 products. The keynote speaker of Microsoft Ignite 2018 was Satya Nadella, the CEO of Microsoft. He was joined by SAP CEO Bill McDermott and Adobe Systems CEO Shantanu Narayen for this powerful keynote delivered to a standing-room-only crowd. There are more than 700 hours of past sessions that you can explore, including keynote presentations, overviews, and deep dives. ",
			website: "https://www.microsoft.com/en-us/ignite",
			tags: ["IT Security", "Computer Systems Analyst", "Web Developer", "Programmer", "Tech convention"],
			type: "conference",
			logo: "https://i.ibb.co/PxYhPRy/Microsoft-Ignite.png"
		},
		{
			title: "IT Arena",
			// date: "September 27-29",
			date: new Date(2019, 8, 27),
			country: "Ukraine",
			city: "Lviv",
			description:
				"IT Arena is the largest tech event in Ukraine and Eastern Europe. The three-day conference, conducted exclusively in English, brings together more than 2,000 entrepreneurs, investors, developers, business analysts, and designers every year. Some of the previous speakers of IT Arena included representatives of Twitter, Uber, Facebook, Philips, Samsung, IBM, Google, and Microsoft and the 2018 conference consisted of four streams: Business, Product, Technology, and Startup. This conference is known for its everyday after parties, which are excellent networking opportunities. On the last day of the conference, the FutureLand Festival takes place, which attracts more than 3,000 visitors. ",
			website: "https://itarena.ua/",
			tags: ["IT Security", "Computer Systems Analyst", "Web Developer", "Programmer", "Tech convention"],
			type: "conference",
			logo: "https://i.ibb.co/j4qnGKt/IT-Arena.png"
		},
		{
			title: "World Summit AI",
			// date: "October 9-10",
			date: new Date(2019, 9, 9),
			country: "Netherlands",
			city: "Amsterdam",
			description:
				"The World Summit Artificial Intelligence (AI) is a unique platform for all AI innovations and projects. World Summit AI is the result of a collaboration between the global City.Ai Network and 100+ international AI events, and it provides unique networking and discussion opportunities for the 2,000 attendees. This two-day conference brings together the three main pieces of the AI system: Enterprise, Startups & Investors, and Deep Tech. ",
			website: "https://worldsummit.ai/",
			tags: ["Programmer", "Computer Systems Analyst", "IT Security", "Tech convention", "Web Developer"],
			type: "conference",
			logo: "https://i.ibb.co/VxFTjvT/World-Summit-AI.jpg"
		}
	];

	events.forEach(event => {
		mydb.event.findOne({ title: event.title }, (err, eventInfo) => {
			if (err) {
				console.log(err);
				return;
			}

			if (eventInfo) {
				// console.log("Event already exists: " + event.title);
				return;
			}

			const newEvent = new mydb.event({
				title: event.title,
				date: event.date,
				country: event.country,
				city: event.city,
				description: event.description,
				website: event.website,
				tags: event.tags,
				type: event.type,
				logo: event.logo
			});

			newEvent.save(err => {
				if (err) {
					console.log(err);
					return;
				}
			});
		});
	});
}

// function uploadJobs() {}

function doYourThing() {
	uploadImages();
	uploadEvents();
}

module.exports = { doYourThing };
