var express = require("express"),
	app     = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine','ejs');

var campgroundSchema = mongoose.Schema({
	name: String,
	image: String,
	description: String
});

var Campground = mongoose.model('Campground', campgroundSchema);

//Campground.create({
//	name: "Mount bleh",
//	image:"https://live.staticflickr.com/4567/37514240304_1a744f1fce_z.jpg",
//	description: "It is very very very very goooooddddd"
//}, function(err, campground){
//	if(err){
//		console.log(err);
//	}
//	else{
//		console.log('New Campground: ');
//		console.log(campground);
//	}
// });

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
	Campground.findById(req.params.id, function(err, found){
		if(err){
			console.log(err);
		} else{
			res.render('show', {campground: found});
		}
	});
});

app.listen(3000, function() { 
  console.log('Server has started'); 
});