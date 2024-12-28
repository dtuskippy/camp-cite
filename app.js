const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const PORT = process.env.PORT || 3001;
const path = require('path');
const Campground = require('./models/campground.model')
const connectDB = require('./config/db.js');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('home');
})

app.get('/campgrounds', async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
})




app.listen(PORT, () => {
  connectDB();
  console.log(`Server is open on port ${PORT}`)
})