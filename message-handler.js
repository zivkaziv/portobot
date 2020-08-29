const User = require("./models/User");
const { requestExecuter } = require("./request-executer");
const { photoSender, textSender } = require("./telegram/senders");
const e = require("express");

const nationalityPasswordPattern = /\d\d\d\d-\d\d\d\d-\d\d\d\d/;

const isNew = (user) => {
	return !user;
};

const canBeScrape = (user) => {
	return user.nationalityPassword;
};

const isMissingNationalityPassword = (user) => {
	return !user.nationalityPassword;
};

const isAlreadyScrapedToday = (user) => {
	return !!user.nationalityPassword;
};

const getNationalityPasswordFromText = (text) => {
	const found = text.match(nationalityPasswordPattern);
	if (found) {
		return found[0];
	}
};

const scrape = async (user, chatId) => {
	const respose = await requestExecuter(
		textSender(chatId),
		photoSender(chatId),
		user.nationalityPassword
	);
	if (respose.success) {
		user.lastCheck = new Date();
		// handle current status;
		await user.save();
	}
};
const handle = async (message) => {
	const user = await User.findOne({ telegramId: message.getUserId() });
	if (isNew(user)) {
		//new user flow
		const newUser = new User({
			firstName: message.getFirstName(),
			lastName: message.getLastName(),
			username: message.getUsername(),
			telegramId: message.getUserId(),
			language: message.getLanguage(),
			chatId: message.getChatId(),
		});
		await newUser.save();

		// Ask for nationalityPassword
		const send = textSender(message.getChatId());
		await send(`Hey ${message.getFirstName()}, nice to meet you:)`);
		await send(
			`I need your code in order to proceed (the one with XXXX-XXXX-XXXX). Send me a message only with your code`
		);
	} else if (canBeScrape(user)) {
		if (message.getText().toLowerCase() === "hit") {
			await scrape(user, message.getChatId());
		} else {
			const send = textSender(message.getChatId());
			send(
				`I don't know what it means... I got all the details, Just write me "hit".`
			);
		}
	} else {
		// is message contains nationalityPassword;
		const nationalityPassword = getNationalityPasswordFromText(
			message.getText()
		);
		if (nationalityPassword) {
			user.nationalityPassword = nationalityPassword;
			user.save();
			await scrape(user, message.getChatId());
		} else {
			const send = textSender(message.getChatId());
			if (isMissingNationalityPassword(user)) {
				await send("You should send me your password");
			} else {
				await send(`I'm not sure what is wrong`);
			}
		}
	}
};

module.exports = {
	handle,
};
