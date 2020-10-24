const TeleBot = require("telebot");
const config = require('config');

const bot = new TeleBot(config.get('telegram.token'));

module.exports = {
	bot,
};
