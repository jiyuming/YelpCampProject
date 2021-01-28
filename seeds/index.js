const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/yelp-camp', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('database connected!')
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random500 = Math.floor(Math.random() * 1000 / 2);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '600779dc78fe8e14c8f610bf',
            location: `${(cities[random500].name)}, ${cities[random500].province}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [{ url: 'https://source.unsplash.com/collection/483251', filename: 'asdf' }, { url: 'https://source.unsplash.com/collection/483251', filename: 'asd' }],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit?',
            price,
            geometry: {
                type: "Point",
                coordinates: [-79.3470, 43.6510]
            }
        });
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});