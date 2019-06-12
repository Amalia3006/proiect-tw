const {XMLHttpRequest} = require("xmlhttprequest");
const cheerio = require("cheerio");
const mydb = require("../models/allModels");



function run() {
	console.log("Meetup scrapper");
	let xhr = new XMLHttpRequest();
	xhr.open("GET","https://www.eventbrite.ca/d/romania/science-and-tech--events/", true);
	xhr.responseType="text/html";

	xhr.onload=e=>{
		if(xhr.readyState===4) {
			if(xhr.status === 200){
				const document =cheerio.load(xhr.responseText);
				//console.log(document);
				document(".search-main-content__events-list")
				.children("li")
				.each((i, el)=>{
					//console.log(i);
					const eventBodyAll= document(el);
					//console.log(eventBodyAll.html());
					let eventBody = eventBodyAll
					.children("div")
					.children("div")
					.children("div")
					.children("div")
					.children("section")
					let eventBodyImg = eventBody.children(".eds-media-card-content__image-container")
					eventBody = eventBody.children("main")
					.children("div")
					let eventBody2 = eventBody.children(".eds-media-card-content__content__principal")
					eventBody= eventBody.children("div")
					.children(".eds-media-card-content__primary-content")
					.children(".eds-media-card-content__action-link")
					const eventWebsite = eventBody.attr("href")
					// console.log(eventWebsite)
					eventBody =eventBody.children("h3")
					.children("div")
					const eventTitle = eventBody.children(".eds-is-hidden-accessible").text()
					//console.log(eventTitle)
					eventBody2 = eventBody2.children(".eds-media-card-content__sub-content")
					const eventDate = eventBody2.children(".eds-text-bs--fixed").text()
					//console.log(eventData)
					const eventLocation = eventBody2.children(".eds-media-card-content__sub-content-cropped")
					.children("div")
					.children("div").text()
					// console.log(eventLocation)
					//console.log(eventBodyForImg)

					const eventBodyDescription= eventBodyImg.children(".eds-media-card-content__action-link").attr("href")
					const eventDescription = getDescription(eventBodyDescription)
					// console.log(eventDescription)

					eventBodyImg= eventBodyImg.children(".eds-media-card-content__action-link")
					.children(".eds-media-card-content__image-wrapper")
					.children(".eds-media-card-content__image-content")
					const eventLink = eventBodyImg.children("img").attr("src")
					// console.log(eventBodyDescription)

					///////////////////////////////////////
					mydb.event.findOne({ title: eventTitle, date: eventDate}, (err, eventInfo)=>{
						
						if(err){
							console.log(err);
							return;
						}

						if(eventInfo){
							eventInfo.location =eventLocation;
							eventInfo.description= eventDescription;
							 eventInfo.website = eventWebsite;
							eventInfo.logo = eventLink;
							//tags
						}
						else{
							 eventInfo= new mydb.event({
								title: eventTitle,
								location: eventLocation,
								date: eventDate,
								description: eventDescription,
								website: eventWebsite,
								logo: eventLink
								
							})
							//console.log("ok");

						}

						
						eventInfo.save(err => {
							if (err) {
								console.log(err);
								return;
							}
							//console.log("Event updated: " + eventTitle)
						});
					})
					

				})


			}
			else {
				console.log("XMLHttpRequest error: status code: " + xhr.status);
			}
		}

	}
	xhr.send();
}


function getDescription(url){
	//console.log(url)
	let xhr = new XMLHttpRequest();
	xhr.open("GET",url, false);
	xhr.responseType="text/html";
	xhr.send(null);
	if(xhr.status===200){
		const document = cheerio.load(xhr.responseText);
		let body = document(".js-xd-read-more-contents")
		const textDesc = body.text()
		//console.log(textDesc)
		console.log("ok")
		return textDesc;
	}
	else{
		console.log("XMLHttpRequest error: status code: " + xhr.status);
	}


}


module.exports = { run };
