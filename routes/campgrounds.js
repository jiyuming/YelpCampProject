const express = require("express");
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const { validateCampground, isLoggedIn, isAuthor } = require('../middleware');  //moved validation middlewares to one file

router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}))


//add a new campground route
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
})

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id; //save campground author
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}))

//show a campground route
router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({  //'populate' is a mongoose function to connect different models; populate review's author
        path: 'reviews', //models/campground.js 'reviews' is a property of a Campground
        populate: {
            path: 'author' //models/review.js 'authos' is a property of a review
        }
    }).populate('author'); //populate campground author
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground })
}))

//edit campground route
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {  //add user authentication checking
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground })
}))

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {  //add user authentication checking
    const campground = await Campground.findByIdAndUpdate(req.params.id, { ...req.body.campground });
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}))

//delete a campground route
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => { //add user authentication checking
    await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds')
}))

module.exports = router;
