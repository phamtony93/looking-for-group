module.exports = function() {
	var express = require('express');
	var router = express.Router();

	// function getNames(res, mysql, context, complete) {
	// 	mysql.pool.query("SELECT id, firstName, lastName FROM Actors", function(error, results, fields) {
	// 		if(error) {
	// 			res.write(JSON.stringify(error));
	// 			res.end();
	// 		}
	// 		context.names = results;
	// 		complete();
	// 	});
	// }

	// function getMovies(res, mysql, context, complete) {
	// 	mysql.pool.query("SELECT id, title FROM Movies", function(error, results, fields) {
	// 		if(error) {
	// 			res.write(JSON.stringify(error));
	// 			res.end();
	// 		}
	// 		context.movies = results;
	// 		complete();
	// 	});
	// }	

	// function getActors(res, mysql, context, complete) {
	// 	mysql.pool.query("SELECT id, firstName, lastName, dateOfBirth, ethnicity FROM Actors", function(error, results, fields) {
	// 		if(error) {
	// 			res.write(JSON.stringify(error));
	// 			res.end();
	// 		}
	// 		context.actors = results;
	// 		complete();
	// 	});
	// }

	// function getActorFiltered(res, mysql, context, id, complete) {
	// 	 var sql ="SELECT id, firstName, lastName, dateOfBirth, ethnicity FROM Actors WHERE id = ?";
	// 	 var inserts = id;
	// 	 sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
	// 		if(error) {
	// 			res.write(JSON.stringify(error));
	// 			res.end();
	// 		}
	// 		context.actors = results[0];
	// 		complete();
	// 	});
	// }

	// function getActorsAndMovies(res, mysql, context, complete) {
	// 	mysql.pool.query("SELECT m.title, a.firstName, a.lastName FROM Movies m INNER JOIN IsIn i ON i.movieID = m.id INNER JOIN Actors a ON a.id = i.actorID", function(error, results, fields) {
	// 		if(error) {
	// 			res.write(JSON.stringify(error));
	// 			res.end();
	// 		}
	// 		context.movieActedIn = results;
	// 		complete();
	// 	})
	// }

	// router.get('/:id', function(req, res) {
	// 	var callbackCount = 0;
	// 	var context = {};
	// 	context.jsscripts = ["updateactors.js"];
	// 	var mysql = req.app.get('mysql');
	// 	var id = req.params.id;
	// 	getActorFiltered(res, mysql, context, id, complete);
	// 	function complete() {
	// 		callbackCount++;
	// 		if (callbackCount >= 1) {
	// 			res.render('update-actors', context);
	// 		}
	// 	}
	// });



	router.get('/', function(req, res) {
		var callbackCount = 0;
		var context = {};
		// context.jsscripts = ["updateactors.js"];
		var mysql = req.app.get('mysql');
		// getNames(res, mysql, context, complete);
		// getActors(res, mysql, context, complete);
		// getMovies(res, mysql, context, complete);
		// getActorsAndMovies(res, mysql, context, complete);
		function complete() {
			callbackCount++;
			if (callbackCount >= 0) {
				res.render('registration', context);
			}
		}
	});

	// router.put('/:id', function(req, res) {
	// 	var mysql = req.app.get('mysql');
	// 	var sql = "UPDATE Actors SET firstName = ?, lastName = ?, dateOfBirth = ?, ethnicity = ? WHERE id = ?";
	// 	var inserts = [req.body.firstName, req.body.lastName, req.body.dateOfBirth, req.body.ethnicity, req.params.id];
	// 	sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
	// 		if(error) {
	// 			res.write(JSON.stringify(error));
	// 			res.end();
	// 		}
	// 		else {
	// 			res.status(200);
	// 			res.end();
	// 		}
	// 	});
	// });

	// router.post('/', function(req, res) {
	// 	var mysql = req.app.get('mysql');
	// 	var sql = "INSERT INTO Actors (firstName, lastName, ethnicity, dateOfBirth) VALUES (?,?,?,?)";
	// 	var inserts = [req.body.firstName, req.body.lastName, req.body.ethnicity, req.body.dateOfBirth];
	// 	sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
	// 		if(error) {
	// 			res.write(JSON.stringify(error));
	// 			res.end();
	// 		}
	// 		else {
	// 			res.redirect('/registration');
	// 		}
	// 	});

	// });

	// router.post('/add-movie-to-actor', function(req, res) {
	// 	var mysql = req.app.get('mysql');
	// 	var sql = "INSERT INTO IsIn (actorID, movieID) VALUES (?,?)";
	// 	var inserts = [req.body.actorID, req.body.movieID];
	// 	sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
	// 		if(error) {
	// 			res.write(JSON.stringify(error));
	// 			res.end();
	// 		}
	// 		else {
	// 			res.redirect('/actors');
	// 		}
	// 	});

	// });	

	return router; 
}();