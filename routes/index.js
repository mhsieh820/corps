

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

