var express = require('express'),
	OAuth = require('oauthio'),
	FitbitApiClient = require("fitbit-node");

var app = express();
OAuth.initialize('d04b6c7d91005317a02515f55373abf0', 'fae1a4233418c72617cd51c6f8c8f772');
var myfitbit = new FitbitApiClient('d04b6c7d91005317a02515f55373abf0', 'fae1a4233418c72617cd51c6f8c8f772');
//OAuth.popup('fitbit').done(function(result) {
//    console.log(result)
//});
console.log("sdafa");
var requestTokenSecrets = {};
app.get("/authorize", function (req, res) {
	console.log("dsfa");
	myfitbit.getRequestToken().then(function (results) {
		var token = results[0],
			secret = results[1];
		//console.log(token);
		//console.log(secret);
		requestTokenSecrets[token] = secret;
		res.redirect("http://www.fitbit.com/oauth/authorize?oauth_token=" + token);
	}, function (error) {
		res.send(error);
	});
});
app.get("localhost:3000/callback", function (req, res) {
	console.log("got here");
	var token = req.query.oauth_token,
		secret = requestTokenSecrets[token],
		verifier = req.query.oauth_verifier;
	myfitbit.getAccessToken(token, secret, verifier).then(function (results) {
		var accessToken = results[0],
			accessTokenSecret = results[1],
			userId = results[2].encoded_user_id;
		return myfitbit.get("/profile.json", accessToken, accessTokenSecret).then(function (results) {
			var response = results[0];
			res.send(response);
		});
	}, function (error) {
		res.send(error);
	});
});
app.listen(3000);
//app.listen(3000);

//var a = myfitbit.getRequestToken();
//var url = "http://www.fitbit.com/oauth/authorize?oauth_token="+a;


// app.get('/OAuth/redirect', OAuth.redirect(function(result, req, res) {
//     //todo
//     console.log(result);
//     console.log("dsfa");
// }));