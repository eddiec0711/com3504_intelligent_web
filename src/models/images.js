const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Image = new Schema({
	title: { type: String, required: true },
	description: { type: String, required: true },
	author: { type: String , required: true},
	filepath: { type: String, required: true }
});

module.exports = mongoose.model("Image", Image);