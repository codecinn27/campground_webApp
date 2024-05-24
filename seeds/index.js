if (process.env.NODE !=="production"){
  require('dotenv').config();
}
const Campground = require('../model/campground'); //outside the directory then ..
const User = require('../model/user');
const cities = require('./cities_malaysia');
const { descriptors, places} = require('./seedHelpers'); //inside the directory then .
const mongoose = require('mongoose');
const db_url = process.env.MONGO_URL;
mongoose.connect( db_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open",()=>{
    console.log("Database connected");
})

const sample = array => array[Math.floor(Math.random()* array.length)];

const seedDb = async()=>{
    await Campground.deleteMany({});
    const citiesLength = cities.length; // Store the length of the cities array
    const firstUser = await User.findOne().sort({ _id: 1 }).select('_id');
    for(let i=0; i<50; i++){
        const randomIndex = Math.floor(Math.random() * citiesLength);
        const price = Math.floor(Math.random()*20)+10;
        const camp = new Campground({
            author: firstUser._id,
            location: `${cities[randomIndex].city} ${cities[randomIndex].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            // image:  `https://source.unsplash.com/random/640x480?camping,${i} `, //https://random.imagecdn.app/500/500
            price,
            description:`Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae, noenim quae odio illum laudantium exercitationem. Harum sapiente, impedit esse odit ab, dolores nobis repellat ratione rerum vitae ut asperiores maxime?`,
            geometry:{
                type:"Point",
                coordinates: [cities[randomIndex].longitude,cities[randomIndex].latitude]
            },
            image:  [
                {
                  url: 'https://res.cloudinary.com/du43x2mnv/image/upload/v1715608437/YelpCamp/chris-holder-uY2UIyO5o5c-unsplash_eabuca.jpg',   
                  filename: 'YelpCamp/vansauzteyfkioufew4a',               
                },
                {
                  url: 'https://res.cloudinary.com/du43x2mnv/image/upload/v1715608435/YelpCamp/everett-mcintire-BPCsppbNRMI-unsplash_up10rb.jpg',   
                  filename: 'YelpCamp/pd5is7pijcrwlld48au6',
                },
                {
                  url: 'https://res.cloudinary.com/du43x2mnv/image/upload/v1715608434/YelpCamp/scott-goodwill-y8Ngwq34_Ak-unsplash_icj8pw.jpg',   
                  filename: 'YelpCamp/wdgp2kjma0ki19wdewty',
                }
              ]
        })
        await camp.save();
    }
}

seedDb().then(()=>{
    mongoose.connection.close();
})

//change the photo with alternating, and the description alternatively

