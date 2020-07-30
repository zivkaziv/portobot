const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const solve = require('./catpch-solver');
const TeleBot = require('telebot');

const chromeOptions = {
  headless:false,
  defaultViewport: null,
  slowMo:10,
  args: ['--no-sandbox', '--user-data-dir="/tmp/chromium"', '--disable-web-security', '--disable-features=site-per-process']
};
const scrape = async (id) => {
    puppeteer.use(StealthPlugin())  
    const browser = await puppeteer.launch(chromeOptions);
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0)
    await page.goto('https://nacionalidade.justica.gov.pt/');
    await page.waitFor(1500);
    await page.type('#SenhaAcesso', id);
    await page.waitFor(1000);
    const results = await solve(page);
    if(!results){
        await browser.close();
        return results || 'Failed to scrape'
    }
    await page.waitFor(1000);
    await page.click('#btnPesquisa');
    await page.waitFor(1000);
    await page.screenshot({path: 'current-status.png'});
    await browser.close();
}


// Start bot
const handleValidMessage = async (msg, id) => {
    msg.reply.text('Got your request');
    const message = await scrape(id);
    if(message){
        msg.reply.text(message);
    }else{
        bot.sendPhoto(msg.chat.id, 'current-status.png');
    }
    msg.reply.text('Done');
}
const bot = new TeleBot('YOUR_BOT_TOKEN');
(async ()=>{
    bot.on('text', async msg => {
        console.log(msg);
        if(msg.text === '/start'){
            msg.reply.text('Hey:) ... What is your name?');
            return;
        }else if(msg.text.toLowerCase() === 'ziv'){
            handleValidMessage(msg, 'XXXX-XXXX-XXXX');
        }else{
            msg.reply.text(`I don't know you... fuck off`);
            return;
        }
    });
 
    bot.start();
})();


process.stdin.resume();