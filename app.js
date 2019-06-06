// NPM modules
const express = require('express');
const passport = require('passport');
// const cookieParser = require('cookie-parser')
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const LocalStrategy = require('passport-local').Strategy;
const handlebars = require('express-handlebars').create({ defaultLayout: 'main' });
const bodyParser = require('body-parser');
const moment = require('moment');

// Mysql DB connection
var mysql = require('./dbcon.js');

// Used for fb auth - wip
// var config = require('./config')
// const FacebookStrategy = require('passport-facebook').Strategy



// Passport.js setup for local strategy
passport.use(new LocalStrategy(
	{ usernameField: 'email' },
	(email, password, done) => {
		console.log("in LocalStrategy")
		var context = {}
		var callbackCount = 0;
		getUserByEmail(email, mysql, context, complete)
		function complete() {
			callbackCount++;
			if (callbackCount >= 1) {
				if (!context.user) {
					return done(null, false, { message: 'Invalid credentials.\n' });
				}
				if (password !== context.user.password) {
					return done(null, false, { message: 'Invalid credentials.\n' });
				}
				console.log("Successful Login")
				return done(null, context.user, { message: 'Successful login \n' });
			}
		}
	}
));

// Tell passport how to serialize the user
passport.serializeUser((user, done) => {
	console.log('Inside serializeUser callback. User id is save to the session file store here')
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	console.log("Inside deserializeUser callback")
	var context = {}
	var callbackCount = 0;
	getUserById(id, mysql, context, complete);
	function complete() {
		callbackCount++
		if (callbackCount >= 1) {
			done(null, context.user)
		}
	}
});

// Create server
const app = express();
app.use(express.static(__dirname + '/public'));
var port = 5861;
app.set('port', port);
app.listen(app.get('port'), function () {
	console.log('Express started on flip1.engr.oregonstate.edu:' + app.get('port') + '; press CTRL + C to terminate')
});

// Add & configure middleware
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
	store: new FileStore(),
	secret: 'keyboard cat',
	resave: true,
	saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());

// app.use(cookieParser());
// app.set('port', 33335);
//app.set('mysql', mysql);

// app.use(session({
// 	secret: 'keyboard cat',
// 	key: 'sid',
// 	resave: true,
// 	saveUninitialized: true
// }));
// app.use(passport.initialize());
// app.use(passport.session());


// Setting up routes
app.get('/', (req, res) => {
	console.log(req.session)
	if (req.isAuthenticated()) {
		res.redirect('/home')
	} else {
		res.redirect('/login')		//add an error message here
	}
})

app.get('/login', (req, res) => {
	res.render('login')
})

app.post('/login', (req, res, next) => {
	console.log('Inside POST /login callback')
	passport.authenticate('local', (err, user, info) => {
		console.log('Inside passport.authenticate() callback');
		console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`)
		console.log(`req.user: ${JSON.stringify(req.user)}`)
		req.login(user, (err) => {
			console.log('Inside req.login() callback')
			console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`)
			console.log(`req.user: ${JSON.stringify(req.user)}`)
			res.redirect('home');
		})
	})(req, res, next);
})

app.get('/logout', function (req, res) {
	req.logout();
	res.redirect('/');
});

// app.get('/home', (req, res) => {
// 	if(req.isAuthenticated()) {

// 		res.render('home')
// 	} else {
// 		res.render('login')
// 	}
// })

app.get('/home', (req, res) => {
	if (req.isAuthenticated()) {
		// get user info
		console.log("is authenticated")
		context = {}
		callbackCount = 0
		getUserById(req.session.passport.user, mysql, context, complete)
		
		// get events info
		context.values = [];
		if (req.query.city != null && req.query.state != null) {
			mysql.pool.query('SELECT * FROM events WHERE city=? and state=?', [req.query.city, req.query.state], function (err, rows, fields) {
				if (err) {
					throw err;
				}
				for (var events in rows) {
					context.values.push({ 'title': rows[events].title, 'id': rows[events].id });
				}
				complete()
			});
		} else if (req.query.search != null && req.query.search != "") {
			console.log(req.query.search)
			mysql.pool.query('SELECT * FROM events WHERE title LIKE ? OR description LIKE ?', ['%'+req.query.search+'%', '%'+req.query.search+'%'], function (err, rows, fields) {
				if (err) {
					throw err;
				}
				for (var events in rows) {
					context.values.push({ 'title': rows[events].title, 'id': rows[events].id });
				}
				complete()
			});
		} else {
			mysql.pool.query('SELECT * FROM events', function (err, rows, fields) {
				if (err) {
					throw err;
				}
				for (var events in rows) {
					context.values.push({ 'title': rows[events].title, 'id': rows[events].id });
				}
				complete()
			});
		}
			
		function complete() {
			callbackCount++
			if (callbackCount >= 2) {
				console.log(context)
				res.render('home', context)
			}
		}

	} else {
		console.log("is not authenticated")
		res.render('login')
	}
})


app.get('/create-event', (req, res) => {
	console.log(req.session)
	console.log("GET home")
	if (req.isAuthenticated()) {
		// get user info
		console.log("is authenticated")
		context = {}
		callbackCount = 0
		getUserById(req.session.passport.user, mysql, context, complete)
		
		// get events info
		context.values = [];
		mysql.pool.query('SELECT * FROM events', function (err, rows, fields) {
			if (err) {
				throw err;
			}
			for (var events in rows) {
				context.values.push({ 'title': rows[events].title, 'id': rows[events].id });
			}
			complete()
		});
		
		function complete() {
			callbackCount++
			if (callbackCount >= 2) {
				console.log(context)
				res.render('create-event', context)
			}
		}

	} else {
		console.log("is not authenticated")
		res.render('login')
	}
})

app.get('/reset-table', function (req, res, next) {
	var context = {};
	mysql.pool.query("DROP TABLE IF EXISTS events", function (err) {
		var createString = "CREATE TABLE events(" +
			"id INT PRIMARY KEY AUTO_INCREMENT," +
			"title VARCHAR(64) NOT NULL," +
			"description VARCHAR(1024) NOT NULL," +
			"address VARCHAR(64) NOT NULL," +
			"city VARCHAR(64) NOT NULL," +
			"state VARCHAR(32) NOT NULL," +
			"zip VARCHAR(32) NOT NULL," +
			"startDate DATE," +
			"endDate DATE," +
			"startTime TIME," +
			"endTime TIME," +
			"upperAge INT," +
			"lowerAge INT," +
			"gender VARCHAR(16))";
		mysql.pool.query(createString, function (err) {
			context.results = "Table reset";
			res.render('home', context);
		})
	});
});

app.post('/add', function (req, res) {
	var body = req.body;
	var gender = "Both";
	if (req.body.Gender == 0) {
		gender = "Female";
	}
	else if (req.body.Gender == 1) {
		gender = "Male";
	}
	var params = [body.eventTitle, body.eventDescription, body.eventAddress, body.eventCity, body.eventState, body.eventZIP, body.startDate, body.endDate, body.lowerAge, body.upperAge, body.Gender];
	mysql.pool.query("INSERT INTO events(`title`, `description`, `address`, `city`, `state`, `zip`, `startDate`, `endDate`, `lowerAge`, `upperAge`, `gender`) VALUES (?,?,?,?,?,?,?,?,?,?,?)", params, function (err, result) {
		if (err) {
			throw err;
		}
		res.redirect('/home')
	});
});

app.get('/view', function (req, res) {
	var id = req.query.id;
	var table = {};
	table.values = [];
	mysql.pool.query('SELECT * FROM events WHERE id = ?', id, function (err, rows, fields) {
		if (err) {
			throw err;
		}
		var startDate = moment(rows[0].startDate);
		var endDate = moment(rows[0].endDate);
		var Both = 0;
		var Female = 0;
		var Male = 0;
		if (rows[0].gender == "Both") {
			Both = 1;
		}
		if (rows[0].gender == "Female") {
			Female = 1;
		}
		if (rows[0].gender == "Male") {
			Male = 1;
		}
		console.log(Both, Female, Male);
		table.values.push({ 'id': rows[0].id, 'title': rows[0].title, 'description': rows[0].description, 'address': rows[0].address, 'city': rows[0].city, 'state': rows[0].state, 'zip': rows[0].zip, 'startDate': startDate.format('YYYY-MM-DD'), 'endDate': endDate.format('YYYY-MM-DD'), 'upperAge': rows[0].upperAge, 'lowerAge': rows[0].lowerAge, 'both': Both, 'female': Female, 'male': Male });
		res.render('view', table.values[0]);
	})
});

app.get('/update', function (req, res) {
	var id = req.query.id;
	var table = {};
	table.values = [];
	mysql.pool.query('SELECT * FROM events WHERE id = ?', id, function (err, rows, fields) {
		if (err) {
			throw err;
		}
		var startDate = moment(rows[0].startDate);
		var endDate = moment(rows[0].endDate);
		var Both = 0;
		var Female = 0;
		var Male = 0;
		if (rows[0].gender == "Both") {
			Both = 1;
		}
		if (rows[0].gender == "Female") {
			Female = 1;
		}
		if (rows[0].gender == "Male") {
			Male = 1;
		}
		console.log(Both, Female, Male);
		table.values.push({'id': rows[0].id, 'title': rows[0].title, 'description': rows[0].description, 'address': rows[0].address, 'city': rows[0].city, 'state': rows[0].state, 'zip': rows[0].zip, 'startDate': startDate.format('YYYY-MM-DD'), 'endDate': endDate.format('YYYY-MM-DD'), 'upperAge': rows[0].upperAge, 'lowerAge': rows[0].lowerAge, 'both': Both, 'female': Female, 'male': Male });
		res.render('update', table.values[0]);
	})
});

app.get('/update-table', function (req, res) {
	var query = req.query;
	var gender = "Both";
	if (req.query.Gender == 0) {
		gender = "Female";
	}
	else if (req.query.Gender == 1) {
		gender = "Male";
	}
	var params = [query.Title, query.Description, query.Address, query.City, query.State, query.ZIP, query.startDate, query.endDate, query.lowerAge, query.upperAge, gender, query.id];
	mysql.pool.query("UPDATE events SET title=?, description=?, address=?, city=?, state=?, zip=?, startDate=?, endDate=?, lowerAge=?, upperAge=?, gender=? WHERE id=?", params, function (err, result) {
		if (err) {
			throw err;
		}
		var tableId = { 'id': result.insertId };
		res.send(tableId);
	});
});

app.get('/registration', function (req, res) {
	res.render('registration');
});

app.post('/registration', (req, res) => {
	console.log(req.body)
	mysql.pool.query("INSERT INTO users (first_name, last_name, email, city, state, bday, gender, password) VALUES (?,?,?,?,?,?,?,?)",
	[req.body.first_name, req.body.last_name, req.body.email, req.body.city, req.body.state, req.body.bday, req.body.gender, req.body.password],
	(err, rows, fields) => {
		if (err)
		{
			throw err;
		}
		res.redirect('/login')
	})
	
})


app.use('/registration', require('./registration.js'));

// app.get('/account', ensureAuthenticated, function (req, res) {
// 	res.render('account', { user: req.user });
// });

// app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

// app.get('/auth/facebook/callback',
// 	passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/login' }),
// 	function (req, res) {
// 		res.redirect('/');
// 	});



// function ensureAuthenticated(req, res, next) {
// 	if (req.isAuthenticated()) { return next(); }
// 	res.redirect('/login')
// }

app.use(function (req, res) {
	res.status(404);
	res.render('404');
});

app.use(function (err, req, res, next) {
	console.log(err.stack);
	res.type('plain/text');
	res.status(500);
	res.render('500');
});

// Helper functions
function getUserByEmail(email, mysql, context, complete) {
	console.log(email)
	mysql.pool.query("SELECT * FROM users WHERE email=?", [email], function (err, rows, fields) {
		if (err) {
			console.log(JSON.stringify(err));
		}
		var params = []
		for (var row in rows) {
			var addItem = { 'id': rows[row].id, 'first_name': rows[row].first_name, 'last_name': rows[row].last_name, 'email': rows[row].email, 'city': rows[row].city, 'state': rows[row].state, 'bday': rows[row].bday, 'gender': rows[row].gender, 'password': rows[row].password }
			params.push(addItem)
		}
		context.user = params[0]
		complete()
	})
}

function getUserById(id, mysql, context, complete) {
	mysql.pool.query("SELECT * FROM users WHERE id=?", [id], function (err, rows, fields) {
		if (err) {
			console.log(JSON.stringify(err));
		}
		var params = []
		for (var row in rows) {
			var addItem = { 'id': rows[row].id, 'first_name': rows[row].first_name, 'last_name': rows[row].last_name, 'email': rows[row].email, 'city': rows[row].city, 'state': rows[row].state, 'bday': rows[row].bday, 'gender': rows[row].gender, 'password': rows[row].password }
			params.push(addItem)
		}
		context.user = params[0]
		complete()
	})
}
