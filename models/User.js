const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
	firstName: { type: String },
	lastName: { type: String },
	username: { type: String },
	telegramId: { type: String, required: true, index: true },
	lastMessage:{ type: Date, default: Date.now },
	language: { type: String },
	chatId: { type: String, required: true },
	nationalityCodes: [{ type: Schema.ObjectId, ref: 'NationalityCode' }],
	pendingInsertCodeRequest: { type: Boolean, default: 'false' },
});

module.exports = User = mongoose.model("User", UserSchema);
