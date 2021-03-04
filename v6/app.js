var express = require("express"),
	app     = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	Campground = require("./models/campground"),
	Comment   = require("./models/comment"),
	User      = require("./models/user"),
	passport  = require("passport"),
	LocalStrategy = require("passport-local");
	seedDB  = require("./seeds");

mongoose.connect("mongodb://localhost:27017/yelp_camp_v6", {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.set('view engine','ejs');
seedDB();

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

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/login');
}

// ROUTES
app.get('/', function(req, res){
	res.render('home');
});

app.get('/campgrounds', function(req, res){
	Campground.find({}, function(err, campgrounds){
		if(err){
			console.log(err);
		} else{
			res.render('campgrounds/index', {campgrounds: campgrounds, currentUser: req.user});
		}
	});	
});


app.post('/campgrounds', function(req, res){
	var name = req.body.name;
	var image = req.body.image;
	var campground = { name: name, image:image }
	Campground.create(campground, function(err, New){
		if(err){
			console.log(err);
		} else{
			res.redirect('index');
		}
	});	
});

app.get('/campgrounds/new', function(req, res){
	res.render('campgrounds/new');
});

app.get('/campgrounds/:id', function(req, res){
	Campground.findById(req.params.id).populate('comments').exec( function(err, found){
		if(err){
			console.log(err);
		} else{
			console.log(found);
			res.render('campgrounds/show', {campground: found});
		}
	});
});

app.get('/campgrounds/:id/comments/new', isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		} else {
			res.render('comments/new', {campground: campground} );
		}
	});	
});

app.post('/campgrounds/:id/comments', isLoggedIn, function(req, res){
	// Find campground
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		} else {
			// Push comment to campground
			Comment.create(req.body.comment, function(err, comment){
				campground.comments.push(comment);
				campground.save();
				res.redirect('/campgrounds/' + campground._id);
			});
		}
	});	
});

// AUTH ROUTES
app.get('/register', function(req, res){
	res.render('register');
});

app.post('/register', function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			re.render('register');
		} else{
			passport.authenticate('local')(req, res, function(){
				res.redirect('/campgrounds');
			});
		}
	});
});

app.get('/login', function(req, res){
	res.render('login');
});

app.post('/login', passport.authenticate('local', {
	successRedirect: '/campgrounds',
	failureRedirect: '/login'
}) , function(req, res){ });

app.get('/logout', function(req, res){
	req.logout();
	res.redirect('/campgrounds');
});

// LISTENING SERVER
app.listen(3000, function() { 
  console.log('Server has started'); 
});