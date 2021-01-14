const express = require("express");
const app = express();
const path = require('path'); //use a node.js self module
const Campground = require('./models/campground') //get exported model from using mongoose
const methodOverride = require('method-override'); //a node.js module, override the req.method property

const mongoose = require('mongoose'); //connect to local databasee
mongoose.connect('mongodb://localhost:27017/yelp-camp', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }); 

//sample code from mongoose to connect to mongoose databse
const db = mongoose.connection; 
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('database connected!')
});

app.set('view engine', 'ejs'); //set view to EJS
app.set('views', path.join(__dirname, '/views')); //join all folders in 'views' folder

app.use(express.urlencoded({ extended: true })) //parse json and urlencoded 
app.use(methodOverride('_method'))

app.get('/', (req, res) => { 
    res.render('home')
})

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds }) //pass a Campground object to a view file(views/campgrounds/index.ejs)
})

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new') //display webpage according to 'views/campgrounds/new.ejs'
})

app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground); //in 'views/campgrounds/new.ejs', <input type="text" id="title" name="campground[title]">
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`) //Mongoose default value: _id - ObjectId, id - string
})

app.get('/campgrounds/:id', async (req, res) => { //Express route path defined: Request URL- http://localhost:3000/campgrounds/1234567
    const campground = await Campground.findById(req.params.id) //req.params.id - {"id": "1234567"}, get the value in that position
    res.render('campgrounds/show', { campground }) 
})

app.get('/campgrounds/:id/edit', async (req, res) => {
    const campground = await Campground.findById(req.params.id) 
    res.render('campgrounds/edit', { campground })
})

app.put('/campgrounds/:id', async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, { ...req.body.campground }); //expand a Campground in the request body into a list {"title","location"}
    res.redirect(`/campgrounds/${campground._id}`)
})

app.delete('/campgrounds/:id', async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    res.redirect('campgrounds')
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})
