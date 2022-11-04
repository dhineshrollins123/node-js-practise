const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.listen(process.env.PORT || 3000, () => {
	console.log("Application is running on port 3000");
});

app.get("/", function (req, res) {
	res.sendFile(__dirname + "/signup.html");
});

// app.get("/success", function(req, res,){
//     res.sendFile(__dirname+"/success.html");
// });

app.post("/", function (req, res) {
	var fName = req.body.fName;
	var lName = req.body.lName;
	var email = req.body.email;

	const jsonDataObj = {
		members: [
			{
				email_address: email,
				status: "subscribed",
				merge_fields: {
					FNAME: fName,
					LNAME: lName,
				},
			},
		],
	};

	const jsonData = JSON.stringify(jsonDataObj);

	const url = "https://us18.api.mailchimp.com/3.0/lists/f3258e300b";

	const options = {
		method: "POST",
		auth: "DK:9d1eefa90ae1cbc383538eab1bce8def-us18",
	};

	const request = https.request(url, options, function (response) {
		if (response.statusCode === 200) {
			console.log("Successfully Signed up");
           // res.send("Success");
			res.sendFile(__dirname + "/success.html");
		} else {
            //res.send("Failed");
			console.log("Error : " + request.statusCode);
            res.sendFile(__dirname + "/failure.html");
		}

		response.on("data", function (data) {
			console.log(JSON.parse(data));
		});
	});

	request.write(jsonData);
	request.end();
});

app.post("/failed", function (req, res,){
    res.redirect("/");
});

