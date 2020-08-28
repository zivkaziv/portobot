const TeleBot = require("telebot");
const { requestExecuter } = require("./request-executer");

const photoSender = (chatId) => (photoToSend) => {
	return bot.sendPhoto(chatId, photoToSend);
};

const bot = new TeleBot(process.env.TELEGRAM_BOT_TOKEN);
(async () => {
	bot.on("text", async (msg) => {
		console.log(msg);
		if (msg.text === "/start") {
			msg.reply.text("Hey:) ... What is your name?");
			return;
		} else if (msg.text.toLowerCase() === "ziv") {
			requestExecuter(
				msg.reply.text,
				photoSender(msg.chat.id),
				process.env.ZIV_ID
			);
		} else {
			msg.reply.text(`I don't know you... fuck off`);
			return;
		}
	});

	bot.start();
})();

process.stdin.resume();
