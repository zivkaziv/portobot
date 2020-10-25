const TelegramMessage = require("../models/TelegramMessage");
const TelegramCallbackQueryMessage = require("../models/TelegramCallbackQueryMessage");
const { handle, handleCallbackQuery } = require("../message-handler");
const { bot } = require("./bot");

const start = () => {
	bot.on("text", async (message) => {
		console.log('received new message:', message);
		const telegramMessage = new TelegramMessage({ message });
		await handle(telegramMessage);
	});
	// Inline button callback
	bot.on('callbackQuery', message => {
		// User message alert
		console.log('callbackQuery', message);
		const telegramMessage = new TelegramCallbackQueryMessage(message);
		handleCallbackQuery(telegramMessage);
		return bot.answerCallbackQuery(message.id, `Inline button callback: ${ message.data }`, true);
	});

	bot.start();
};

module.exports = {
	start,
};
