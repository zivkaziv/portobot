const express = require("express");
const path = require("path");
const telegramBot = require("./telegram-bot");
const app = express();
const { photoSender, textSender } = require("./telegram-bot");
const { requestExecuter } = require("./request-executer");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post("/messages/:token", function (req, res) {
	console.log(req.body);
	const chatId = req.body.message.chat.id;
	const text = req.body.message.text.toLowerCase();
	if (text === "/start") {
		textSender(chatId)("Hey:) ... What is your name?");
		return;
	} else if (text.toLowerCase() === "ziv") {
		requestExecuter(
			textSender(chatId),
			photoSender(chatId),
			process.env.ZIV_ID
		);
	} else {
		textSender(chatId)(`I don't know you... fuck off`);
		return;
	}
	res.status(200).send();
});

app.get("/admin/:name", function (req, res) {
	res.sendFile(path.join(__dirname + `/public/admin/${req.params.name}.html`));
});

const PORT = process.env.PORT || 8081;
const server = app.listen(PORT, () => {
	const host = server.address().address;
	const port = server.address().port;

	console.log("Portobot app listening at http://%s:%s", host, port);
});
