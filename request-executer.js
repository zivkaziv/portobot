const { scrape } = require("./scraping/scrape");

const requestExecuter = async (textSender, photoSender, id) => {
	textSender("Got your request");
	const message = await scrape(id);
	if (message) {
		textSender(message);
	} else {
		photoSender(`${id}.png`);
		textSender("Done.... Please spread the word about me...");
	}
};

module.exports = {
	requestExecuter,
};
