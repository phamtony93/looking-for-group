module.exports = function() {
	var express = require('express');
	var router = express.Router();

	function getEvents(res, mysql, context, complete) {
		mysql.pool.quer("SELECT")
	}



	router.get('/', function(req, res) {
		var callbackCount = 0;
		var context = {};
		var mysql = req.app.get('mysql');
		if (req.isAuthenticated) {
			var callbackCount = 0;
			var context = {}

			function complete() {
				callbackCount++;
				if(callbackCount >= 0) {
					res.render('home', context);
				}
			}
			res.render('home')
		} else {
			res.render('login')
		}
		// res.render('registration', context);
	// 	function complete() {
	// 		callbackCount++;
	// 		if (callbackCount >= 0) {
	// 			res.render('registration', context);
	// 		}
	// 	}
	// });

	return router; 
}();