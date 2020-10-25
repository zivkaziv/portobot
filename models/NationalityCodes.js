const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Nationality Codes Schema
const NationalityCodesSchema = new Schema({
	user: { type: Schema.ObjectId, ref: 'User', required: true },
	code: { type: String, required: true},
	name: { type: String},
	lastCheck: { type: Date, default: null },
	currentStatus: {type: String, enum : ['1', '2', '3', '4', '5', '6', '7']},
	processNumber: { type: String },
	processStartYear: { type: String },
	processLocation: { type: String },
	processFullName: { type: String },
	status: {type: String, enum : ['ACTIVE', 'DELETED']},
});

NationalityCodesSchema.index({ user: 1, code: 1 }, { unique: true });

module.exports = User = mongoose.model("NationalityCode", NationalityCodesSchema);
