const TeleBot = require("telebot");

const botToken =
	process.env.TELEGRAM_BOT_TOKEN ||
	"1233225492:AAHUOsqFKzStqjCG5aXXtCFJMBk_66yjQcA";
const bot = new TeleBot(botToken);

module.exports = {
	bot,
};
