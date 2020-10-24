const CronJob = require('cron').CronJob;
const checkStatusJob = require('./checkStatusJob');
function schedule () {
  console.log ('SCHEDULED!!!');

  const checkStatusCronJob = new CronJob ({
    cronTime: '0 0 12 * * *',
    onTick () {
      checkStatusJob.run ();
    },
    start: true,
    timeZone: 'Asia/Jerusalem',
  });
  checkStatusCronJob.start ();
}

exports.schedule = schedule;
