var express = require("express"),
	app     = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	Campground = require("./models/campground"),
	seedDB  = require("./seeds");

mongoose.connect("mongodb://localhost:27017/yelp_camp_v3", {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine','ejs');
seedDB();

app.get('/', function(req, res){
	res.render('home');
});

app.get('/campgrounds', function(req, res){
	Campground.find({}, function(err, campgrounds){
		if(err){
			console.log(err);
		} else{
			res.render('index', {campgrounds: campgrounds});
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
			res.redirect('/index');
		}
	});	
});

app.get('/campgrounds/new', function(req, res){
	res.render('new');
});

app.get('/campgrounds/:id', function(req, res){
	Campground.findById(req.params.id).populate('comments').exec( function(err, found){
		if(err){
			console.log(err);
		} else{
			console.log(found);
			res.render('show', {campground: found});
		}
	});
});

app.listen(3000, function() { 
  console.log('Server has started'); 
});