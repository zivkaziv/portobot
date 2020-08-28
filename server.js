const express = require("express");
const path = require("path");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post("/message", function (req, res) {
	console.log(req.body);
	res.status(200).send();
});

app.get("/admin/:name", function (req, res) {
	res.sendFile(path.join(__dirname + `/public/admin/${req.params.name}.html`));
});

const PORT = process.env.PORT || 8081;
const server = app.listen(PORT, () => {
	const host = server.address().address;
	const port = server.address().port;

	console.log("Portobot app listening at http://%s:%s", host, port);
});
