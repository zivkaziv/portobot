const { bot } = require("./bot");

const photoSender = (chatId) => async (photoToSend) => {
	return bot.sendPhoto(chatId, photoToSend);
};

const textSender = (chatId) => async (text) => {
	return bot.sendMessage(chatId, text);
};

module.exports = {
	textSender,
	photoSender,
};
