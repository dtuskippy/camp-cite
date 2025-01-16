const mongoose = require('mongoose');

const campgroundSchema = new mongoose.Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String
})


const Campground = mongoose.model('Campground', campgroundSchema);
// standard is to name 'Product' (capitalized and singular), and then mongoose makes it to plural lower case

module.exports = Campground;

// const campgroundSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true
//   },
//   price: {
//     type: Number,
//     required: true
//   },
//   description: {
//     type: String,
//     required: true
//   },
//   location: {
//     type: String,
//     required: true
//   }
// }, {
//   timestamps: true // createdAt, updatedAt fields on each document
// })

