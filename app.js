const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const PORT = process.env.PORT || 3001;
const path = require('path');
const Campground = require('./models/campground.model')
const connectDB = require('./config/db.js');
const methodOverride = require('method-override');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true}))
app.use(express.json());
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
  res.render('home');
})

app.get('/campgrounds', async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
})

app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
}) 

app.post('/campgrounds', async (req, res) => {
  const submitCampground =  req.body.campground;
  const newCampground = new Campground(submitCampground);
  await newCampground.save();
  res.redirect(`/campgrounds/${newCampground._id}`)
})

app.get('/campgrounds/:id/edit', async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render('campgrounds/edit', { campground });
})

app.put('/campgrounds/:id', async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
  res.redirect(`/campgrounds/${campground._id}`)
})



app.get('/campgrounds/:_id', async (req, res) => {
  const id  = req.params;
  const campground = await Campground.findById(id);
  res.render('campgrounds/show', { campground });
})






app.listen(PORT, () => {
  connectDB();
  console.log(`Server is open on port ${PORT}`)
})