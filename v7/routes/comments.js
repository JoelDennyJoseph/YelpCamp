var express = require('express'),
    router  = express.Router({ mergeParams: true}),
	Campground = require('../models/campground'),
	Comment = require('../models/comment');

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/login');
}

router.get('/new', isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		} else {
			res.render('comments/new', {campground: campground} );
		}
	});	
});

router.post('/', isLoggedIn, function(req, res){
	// Find campground
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		} else {
			// Push comment to campground
			Comment.create(req.body.comment, function(err, comment){
				comment.author.id = req.user._id;
				comment.author.username = req.user.username;
				comment.save();
				campground.comments.push(comment);
				campground.save();
				res.redirect('/campgrounds/' + campground._id);
			});
		}
	});	
});

module.exports = router;