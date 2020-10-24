const { requestExecuter } = require("./request-executer");
const { photoSender, textSender, getCurrentStatusResponse } = require("./telegram/senders");
const mongoose = require('mongoose');
const User = mongoose.model('User');
const NationalityCode = mongoose.model('NationalityCode');

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

const scrape = async (user, chatId, nationalityCode) => {
	const response = await requestExecuter(
		textSender(chatId),
		photoSender(chatId),
		nationalityCode
	);
	if (response.success) {
		user.nationalityCodes.map(nc => {
			if (nc.code === nationalityCode) {
				nc.lastCheck = Date.now();
				nc.save();
			}
		})
		// handle current status;
		await user.save();
	}
};

const handleCallbackQuery = async (message) => {
	console.log('handle CallbackQuery');
	let user = await User.findOne ({telegramId: message.getUserId ()})
		.populate({
			path: 'nationalityCodes',
			match: { status: 'ACTIVE' }
		});

	if (!user) {
		//todo: send to /start
		return;
	}
	console.log('message', message);
	if (message.getText().indexOf ('Get Current Status for:') === 0) {
		const code = message.getData();
		console.log(`Scrape code ${code} for ${user.firstName} in chat ${message.getChatId()}`);
		scrape(user, message.getChatId(), message.getData())
		return;
	}
	if (message.getText().indexOf ('DELETE: select the code:') === 0) {
		const code = message.getData();
		console.log(`Scrape code ${code} for ${user.firstName} in chat ${message.getChatId()}`);
		const results = await NationalityCode.deleteOne({code});
		await NationalityCode.findOneAndUpdate({user, code},
			{status: 'DELETED'},
			{upsert: false, new: true, setDefaultsOnInsert: true});
		const send = textSender (message.getChatId ());
		send(`Code ${code} has been removed from your account`)
		return;
	}

}

const handle = async (message) => {
	console.log('handle message');
	try {
		let user = await User.findOne ({telegramId: message.getUserId ()})
		.populate({
			path: 'nationalityCodes',
			match: { status: 'ACTIVE' }
		});
		if (isNew (user)) {
			//new user flow
			console.log ('saving new user');
			const newUser = new User ({
				firstName: message.getFirstName (),
				lastName: message.getLastName (),
				username: message.getUsername (),
				telegramId: message.getUserId (),
				language: message.getLanguage (),
				chatId: message.getChatId (),
			});
			await newUser.save ();

			user = await User.findOne ({telegramId: message.getUserId ()})

			// Ask for nationalityPassword
			const send = textSender (message.getChatId ());
			// await send(`Hey ${message.getFirstName()}, nice to meet you:)`);
			await send (
				`*Welcome, ${message.getFirstName ()}*\n type \'?\' to see all options`,
				{parse_mode: 'markdown'});
			// await send(
			// 	`I need your code in order to proceed (the one with XXXX-XXXX-XXXX). Send me a message only with your code`
			// );
		}

		if (!user) {
			//todo: send to /start
			return;
		}
		const send = textSender (message.getChatId ());

		if (user.pendingInsertCodeRequest) {
			const nationalityCode = getNationalityPasswordFromText(
					message.getText()
				);
			if (nationalityCode) {
				const newNationalityCode = await NationalityCode.findOneAndUpdate({user, code: nationalityCode},
					{user, code: nationalityCode, status: 'ACTIVE'},
					{upsert: true, new: true, setDefaultsOnInsert: true});
				user.nationalityCodes = [...(user.nationalityCodes || []), newNationalityCode];
			}

			user.pendingInsertCodeRequest = false;
			await user.save();
			await send(`Code ${nationalityCode} was added to your list`);
		}

		if (message.getText ().toLowerCase ().indexOf ('?') === 0) {
			await send ('Choose:', {
				'replyMarkup': {
					'keyboard': [
						[
							'Insert new nationality code',
							'View my nationality codes'],
						['Get current status'],
						['Delete nationality code']],
				},
			});
			return;
		}

		if (message.getText ().indexOf ('Insert new nationality code') === 0) {
			await send (
				`Please enter your nationality code (the one with XXXX-XXXX-XXXX). Send me a message only with your code`);
			user.pendingInsertCodeRequest = true;
			await user.save ();
			return;
		}

		if (message.getText ().indexOf ('View my nationality codes') === 0) {
			if (!user.nationalityCodes || user.nationalityCodes.length === 0) {
				await send (`You don't have nationality codes`);
				return;
			}
			await send (`Your Nationality code:`);
			user.nationalityCodes.map (async nationalityCode => {
				if (nationalityCode.status === 'ACTIVE') {
					await send (nationalityCode.code);
				}
			});
			return;
		}

		if (message.getText ().indexOf ('Get current status') === 0) {
			if (!user.nationalityCodes || user.nationalityCodes.length === 0) {
				await send (`You don't have nationality codes`);
			}
			const codes = await user.nationalityCodes.map (nc => nc.code);
			console.log('codes', codes );
			const sender = getCurrentStatusResponse(message.getChatId ());
			sender(codes);
			return;
		}

		if (message.getText ().indexOf ('Delete nationality code') === 0) {
			if (!user.nationalityCodes || user.nationalityCodes.length === 0) {
				await send (`You don't have nationality codes`);
			}
			const codes = await user.nationalityCodes.map (nc => nc.code);
			console.log('codes', codes );
			const sender = getCurrentStatusResponse(message.getChatId ());
			sender(codes);
			return;
		}
	} catch (e) {
		console.log('e', e);
	}


	// if (canBeScrape(user)) {
	// 	if (message.getText().toLowerCase() === "hit") {
	// 		await scrape(user, message.getChatId());
	// 	} else {
	// 		const send = textSender(message.getChatId());
	// 		send(
	// 			`I don't know what it means... I got all the details, Just write me "hit".`
	// 		);
	// 	}
	// } else {
	// 	// is message contains nationalityPassword;
	// 	const nationalityPassword = getNationalityPasswordFromText(
	// 		message.getText()
	// 	);
	// 	if (nationalityPassword) {
	// 		user.nationalityPassword = nationalityPassword;
	// 		user.save();
	// 		await scrape(user, message.getChatId());
	// 	} else {
	// 		const send = textSender(message.getChatId());
	// 		if (isMissingNationalityPassword(user)) {
	// 			await send("You should send me your password");
	// 		} else {
	// 			await send(`I'm not sure what is wrong`);
	// 		}
	// 	}
	// }
};

module.exports = {
	handle,
	handleCallbackQuery,
	scrape
};
