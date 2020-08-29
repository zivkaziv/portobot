const { scrape } = require("./scraping/scrape");

const requestExecuter = async (textSender, photoSender, id) => {
	textSender("Starting to work on your request");
	const message = await scrape(id);
	if (message) {
		await textSender(message);
		return {
			failed: {},
		};
	} else {
		await photoSender(`${id}.png`);
		await textSender("Done.... Please spread the word about me...");
		await textSender(`Just write me "hit" and I'll check the status for you`);
		return {
			success: {},
		};
	}
};

module.exports = {
	requestExecuter,
};
