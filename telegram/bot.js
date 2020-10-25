const TeleBot = require("telebot");

const botToken = process.env.TELEGRAM_BOT_TOKEN || "1233225492:AAFA1vVdnEJxRDGkAWRuazMrb_vt2mcqZdc";
const bot = new TeleBot(botToken);

module.exports = {
	bot,
};
