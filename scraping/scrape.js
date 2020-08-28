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
	puppeteer.use(StealthPlugin());
	const browser = await puppeteer.launch(chromeOptions);
	const page = await browser.newPage();
	await page.setDefaultNavigationTimeout(0);
	await page.goto("https://nacionalidade.justica.gov.pt/");
	await page.waitFor(1500);
	//var cookiesToDelete = await page._client.send('Network.getAllCookies');
	await page.type("#SenhaAcesso", id);
	await page.waitFor(1000);
	const results = await solve(page);
	if (results.error) {
		await browser.close();
		return results.errorMessage || "Failed to scrape";
	}
	await page.waitFor(1000);
	await page.click("#btnPesquisa");
	await page.waitFor(1000);
	await page.screenshot({ path: `${id}.png`, fullPage: true });
	await browser.close();
};

module.exports = {
	scrape,
};
