const { bot } = require("./bot");

const photoSender = (chatId) => async (photoToSend) => {
	return bot.sendPhoto(chatId, photoToSend);
};

const textSender = (chatId) => async (text, options = {}) => {
	return bot.sendMessage(chatId, text, options);
};

const getCurrentStatusResponse = (chatId) => async (codes) => {
	let replyMarkup = bot.inlineKeyboard([
		await codes.map(c => {
		 return bot.inlineButton(c, {callback: c});
		}),
	]);
	return bot.sendMessage(chatId, 'Get Current Status for:', {replyMarkup});
};

const sendDeleteCodeResponse = (chatId) => async (codes) => {
	let replyMarkup = bot.inlineKeyboard([
		await codes.map(c => {
			return bot.inlineButton(c, {callback: c});
		}),
	]);
	return bot.sendMessage(chatId, 'DELETE: select the code:', {replyMarkup});
};


module.exports = {
	textSender,
	photoSender,
	getCurrentStatusResponse,
};
