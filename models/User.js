const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
	firstName: {
		type: String,
	},
	lastName: {
		type: String,
	},
	username: {
		type: String,
	},
	telegramId: {
		type: String,
		required: true,
		index: true,
    },
    language: {
		type: String,
	},
	chatId: {
		type: String,
		required: true,
	},
	nationalityPassword: {
		type: String,
    },
    lastMessage:{
        type: Date,
		default: Date.now,
    },
	lastCheck: {
		type: Date,
	},
	currentStatus: {
		type: String,
	},
	processNumber: {
        type: String,
    },
    processStartYear: {
        type: String,
    },
    processLocation: {
        type: String,
    },
    processFullName: {
        type: String,
    },
});

module.exports = User = mongoose.model("users", UserSchema);
