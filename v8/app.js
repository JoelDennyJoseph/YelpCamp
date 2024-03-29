var express = require("express"),
	app     = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	Campground = require("./models/campground"),
	Comment   = require("./models/comment"),
	User      = require("./models/user"),
	passport  = require("passport"),
	methodOverride = require("method-override"),
	LocalStrategy = require("passport-local");
	seedDB  = require("./seeds");

var campgroundRoutes = require('./routes/campgrounds'),
	commentRoutes    = require('./routes/comments'),
	indexRoutes      = require('./routes/index.js');

mongoose.connect("mongodb://localhost:27017/yelp_camp3", {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.set('view engine','ejs');
//seedDB();

// PASSPORT CONFIGURATION
app.use(require('express-session')({
	secret: 'Hey my name is joel',
	resave: false,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// MIDDLEWARE
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});

app.use(indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

// LISTENING SERVER
app.listen(3000, function() { 
  console.log('Server has started'); 
});