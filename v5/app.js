var express = require("express"),
	app     = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	Campground = require("./models/campground"),
	Comment   = require("./models/comment");
	seedDB  = require("./seeds");

mongoose.connect("mongodb://localhost:27017/yelp_camp_v4", {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
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
			res.render('campgrounds/index', {campgrounds: campgrounds});
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

app.get('/campgrounds/:id/comments/new', function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		} else {
			res.render('comments/new', {campground: campground} );
		}
	});	
});

app.post('/campgrounds/:id/comments', function(req, res){
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

app.listen(3000, function() { 
  console.log('Server has started'); 
});