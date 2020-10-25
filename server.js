const express = require("express");
const fs = require('fs');
const path = require("path");
const mongoose = require("mongoose");
const app = express();
const config = require('config');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());


const models = path.join(__dirname, 'models');
fs.readdirSync(models)
.filter(file => ~file.search(/^[^.].*\.js$/))
.forEach(file => require(path.join(models, file)));

const cronJobsScheduler = require ('./cron/scheduler').schedule;
const telegramBot = require("./telegram/telegram-bot");
const TelegramMessage = require("./models/TelegramMessage");
const { handle } = require("./message-handler");

app.post("/messages/:token", async (req, res) => {
	try {
		console.log(req.body);
		const telegramMessage = new TelegramMessage(req.body);
		await handle(telegramMessage);
		res.status(200).send();
	} catch (e) {
		console.error(e);
		res.status(200).send();
	}
});

app.get("/admin/:name", function (req, res) {
	res.sendFile(path.join(__dirname + `/public/admin/${req.params.name}.html`));
});

// const server = app.listen(PORT, () => {
// 	const host = server.address().address;
// 	const port = server.address().port;
//
// 	console.log("Portobot app listening at http://%s:%s", host, port);
// });

const PORT = process.env.PORT || 8081;
function listen () {
	const server = app.listen (PORT, () => {
		const host = server.address().address;
		const port = server.address().port;
		console.log("Portobot app listening at http://%s:%s", host, port);
		telegramBot.start();
		cronJobsScheduler();
		// if ((env !== 'development')) {
		// cronJobsScheduler ();
		// }
	});
}

// MongoDB
console.log ('Connect to mongo DB');
connectMongoDB();
// mongoose.set('debug', env === 'development');
mongoose.set('debug', true);
function connectMongoDB () {
	console.log ('connect to MongoDB @ ', config.get('mongo.url'));
	mongoose.connection
	.on('error', (err) => console.log(`connectMongoDB Error: ${err}`))
	.on('disconnected', (err) => {
		console.log('disconnected', err);
		connectMongoDB();
	})
	.once('open', listen);

	return mongoose.connect(config.get('mongo.url'), {
		// keepAlive: 1,
		// dbName: "portobot",
		auth: {
			user: config.get('mongo.user'),
			password: config.get('mongo.password'),
		},
		// authSource:"admin",
		ssl: true,
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true,
	});
}
