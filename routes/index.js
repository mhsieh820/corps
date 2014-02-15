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
		
		
		//send mail using sendgrid node code
			
	}
	
};