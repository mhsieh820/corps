var sendgrid  = require('sendgrid')('rrmallya', 'corpsgame');

exports.index = function () {
	return function(req, res) {
		res.render('server');	
	}
};

exports.client = function () {
	return function(req, res) {
		res.render('client');	
	}
};

exports.email = function (sendgrid) {
	
	return function(req, res) {
		//get req variable
		sendgrid.send({
		  to:       'mhsieh820@gmail.com',
		  from:     'game@corpsgame.com',
		  subject:  'Hello World',
		  text:     'My first email through SendGrid.'
		}, function(err, json) {
		  if (err) { return console.error(err); }
		  console.log(json);
		});
		
		//send mail using sendgrid node code
			
	}
	
};

exports.sendemail = function (sendgrid) {
	
	return function(req, res) {
		//get req variable
		sendgrid.send({
		  to:       'mhsieh820@gmail.com',
		  from:     'game@corpsgame.com',
		  subject:  'Hello World',
		  text:     'My first email through SendGrid.'
		}, function(err, json) {
		  if (err) { return console.error(err); }
		  console.log(json);
		});
		
		//send mail using sendgrid node code
			
	}
	
};