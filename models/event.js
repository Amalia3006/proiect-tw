const { Schema, model } = require("mongoose");

const eventSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	// type: {
	// 	type: String
	// },
	// expRequired: {
	// 	type: String
	// },
	// country: {
	// 	type: String
	// },
	// city: {
	// 	type: String
	// },
	location:{
		type: String
	},
	tags: {
		type: Array
	},
	date: {
		//type: Date
		 type: String
	},
	description: {
		type: String,
		//required: true
	},
	website: {
		type: String,
		//required: true
	},
	logo: {
		type: String
	}
});

const event = model("event", eventSchema);

module.exports = { event };
