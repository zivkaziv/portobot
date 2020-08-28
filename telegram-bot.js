const TeleBot = require("telebot");
const botToken = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TeleBot(botToken);

const photoSender = (chatId) => (photoToSend) => {
	return bot.sendPhoto(chatId, photoToSend);
};

const textSender = (chatId) => (text) => {
	return bot.sendMessage(chatId, text);
};

module.exports = {
	textSender,
	photoSender,
};
