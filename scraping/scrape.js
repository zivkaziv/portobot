const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const solve = require("./catpch-solver");

const chromeOptions = {
	headless: true,
	defaultViewport: null,
	slowMo: 10,
	args: [
		"--no-sandbox",
		'--disable-setuid-sandbox',
		'--user-data-dir="/tmp/chromium"',
		"--disable-web-security",
		"--disable-features=site-per-process",
	],
};

const scrape = async (id) => {
	console.log(`${id} - Start sraping`);
	puppeteer.use(StealthPlugin());
	const browser = await puppeteer.launch(chromeOptions);
	console.log(`${id} - puppeteer.launch`);
	const page = await browser.newPage();
	console.log(`${id} - browser.newPage`);
	await page.setDefaultNavigationTimeout(0);
	await page.goto("https://nacionalidade.justica.gov.pt/");
	console.log(`${id} - open website`);
	await page.waitFor(1500);
	//var cookiesToDelete = await page._client.send('Network.getAllCookies');
	await page.type("#SenhaAcesso", id);
	console.log(`${id} - type id`);
	await page.waitFor(1000);
	const results = await solve(page);
	console.log(`${id} - solve captcha`);
	if (results.error) {
		await browser.close();
		return results.errorMessage || "Failed to scrape";
	}
	await page.waitFor(1000);
	await page.click("#btnPesquisa");
	await page.waitFor(1000);
	await page.screenshot({ path: `${id}.png`, fullPage: true });
	console.log(`${id} - taking screenshot`);
	await browser.close();
};

module.exports = {
	scrape,
};
