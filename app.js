var express = require('express');
var passport = require('passport');
var cookieParser = require('cookie-parser')
var FacebookStrategy = require('passport-facebook').Strategy
var session = require('express-session')
var config = require('./config')
//var mysql = require('./dbcon.js');

//Passport session setup
passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(obj, done) {
	done(null, obj);
});

// Use the FacebookStrategy within Passport.

passport.use(new FacebookStrategy({
    clientID: config.facebook_api_key,
    clientSecret:config.facebook_api_secret ,
    callbackURL: config.callback_url
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      //Check whether the User exists or not using profile.id
      if(config.use_database) {
        // if sets to true
        pool.query("SELECT * from user_info where user_id="+profile.id, (err,rows) => {
          if(err) throw err;
          if(rows && rows.length === 0) {
              console.log("There is no such user, adding now");
              pool.query("INSERT into user_info(user_id,user_name) VALUES('"+profile.id+"','"+profile.username+"')");
          } else {
              console.log("User already exists in database");
          }
        });
      }
      return done(null, profile);
    });
  }
));




var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');

app.use(express.static(__dirname+'/public'));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use(cookieParser());
app.set('port',33335);
//app.set('mysql', mysql);

app.use(session({ secret: 'keyboard cat',
					key: 'sid',
				resave: true,
				saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/',function(req,res){
	res.render('login');
});

// app.use('/registration', require('./registration.js'));

app.get('/registration',function(req,res){
	res.render('registration');
});


app.get('/account', ensureAuthenticated, function(req, res){
	res.render('account', { user: req.user });
  });
  
app.get('/auth/facebook', passport.authenticate('facebook',{scope:'email'}));
  
app.get('/auth/facebook/callback',
passport.authenticate('facebook', { successRedirect : '/', failureRedirect: '/login' }),
function(req, res) {
  res.redirect('/');
});
  
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});
  
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

app.use(function(req,res){
	res.status(404);
	res.render('404');
});

app.use(function(err,req,res,next){
	console.log(err.stack);
	res.type('plain/text');
	res.status(500);
	res.render('500');
});

app.listen(app.get('port'),function(){
	console.log('Express started on http://localhost:' + app.get('port') + '; press CTRL + C to terminate')
});