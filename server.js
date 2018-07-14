require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mailgun = require("mailgun-js");
const path = require('path');

const mg = mailgun({
	apiKey: process.env.MAILGUN_API_KEY,
	domain: process.env.MAILGUN_DOMAIN
});

const app = express();

app.use(bodyParser.urlencoded({
	extended: false
}));

app.use(express.static(path.resolve('./public')));
app.use(bodyParser.json());

app.post('/survey', async (req, res) => {
	console.log('received form data: ', req.body);

	if (process.env.ENABLED !== 'true') {
		res.status(503).json({msg: 'site disabled'});
	}

	let email = {
		from: process.env.MAILGUN_FROM_EMAIL,
		to: process.env.MAILGUN_TARGET_EMAIL,
		subject: "Survey Result",
		text: JSON.stringify(req.body, null, '\t')
	};

	try {
		let result = await mg.messages().send(email);
		console.log(result);
		res.status(200).json({success: true});
	} catch (error) {
		console.error(error);
		res.status(500).json({success: false});
	}
});

app.listen(process.env.PORT, () => {
	console.log(`Example app listening on port ${process.env.PORT}!`);
});