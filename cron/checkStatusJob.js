const CronJob = require ('cron').CronJob;
const mongoose = require('mongoose');
const {scrape} = require('../message-handler');
const User = mongoose.model('User');
const NationalityCode = mongoose.model('NationalityCode');

async function run () {
  console.log('running checkStatusJob');
  const nationalityCodes = await NationalityCode.find ().
    sort ({lastCheck: -1}).
    populate ('user');
  console.log(`checkStatusJob: found ${nationalityCodes.length} nationality codes to check`);
  nationalityCodes.map(nationalityCode => {
    scrape(nationalityCode.user, nationalityCode.user.chatId, nationalityCode.code);
  });
}

exports.run = run;
