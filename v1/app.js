var express = require("express"),
	app     = express(),
	bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine','ejs');

var campgrounds = [
	{ name: "Salmon Creak", image:"https://foresthillstala.com/images/weekends-forest-campground/weekends-forest-campground-12.jpg" },
	{ name: "Mount bleh", image:"https://live.staticflickr.com/4567/37514240304_1a744f1fce_z.jpg" },
	{ name: "Silicon Valley", image:"https://q-cf.bstatic.com/images/hotel/max1024x768/227/227871385.jpg" }
];

app.get('/', function(req, res){
	res.render('home');
});

app.get('/campgrounds', function(req, res){
	res.render('campgrounds', {campgrounds: campgrounds});
});


app.post('/campgrounds', function(req, res){
	var name = req.body.name;
	var image = req.body.image;
	var campground = { name: name, image:image }
	campgrounds.push(campground);
	
	res.redirect('/campgrounds');
});

app.get('/campgrounds/new', function(req, res){
	res.render('new');
});

app.listen(3000, function() { 
  console.log('Server has started'); 
});