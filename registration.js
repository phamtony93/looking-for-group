module.exports = function() {
	var express = require('express');
	var router = express.Router();

	router.get('/', function(req, res) {
		// var callbackCount = 0;
		var context = {};
		var mysql = req.app.get('mysql');
		res.render('registration', context);
		// function complete() {
		// 	callbackCount++;
		// 	if (callbackCount >= 0) {
		// 		res.render('registration', context);
		// 	}
		// }
	});

	return router; 
}();