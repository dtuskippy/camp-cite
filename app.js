const express = require('express');
const app = express();
const mongoose = require('mongoose');
const engine = require('ejs-mate');
require('dotenv').config();
const PORT = process.env.PORT || 3001;
const path = require('path');
const Campground = require('./models/campground.model')
const connectDB = require('./config/db.js');
const methodOverride = require('method-override');
const morgan = require('morgan');

app.engine('ejs', engine)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true}))
app.use(express.json());
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use((req, res, next) => {
  console.log(req.method.toUpperCase(), req.path);
  next();
})
// app.use((req, res, next) => {
//   console.log("My first middleware!");
//   return next();
//   console.log('This is my middleware 1.2 after calling next()')
// })
// app.use((req, res, next) => {
//   console.log("My second middleware!");
//   next();
// })

const requestTime = function (req, res, next) {
  req.requestTime = Date.now();
  next();
}
app.use(requestTime)
//app.use gets used on every single request fo alll above, e.g. express.json parses body of every request into json
//keep in mind that 'req, res, next' can be called ANYTHING -- JUST PARAMETERS IN A FUNCTION!!!!
//keep in mind that once you call res.send ... it stops everything afterwards, i.e. you only get one response, so can put next in the same function
//and you can throw a console.log after next() within the middleware function and it will run ... BUT after the next middleware and/or route gets called ...
//btw, morgan runs at end because that is specific to morgan -- it measures full response time, so always executes at end, evidently
//can 'return next()', and that insures nothing will run after next within the middleware function where next occurs

app.use('/cats', (req, res, next) => {
  console.log('Gizmo sleeps sooooo much!');
  res.send('<h1>Gizmo sleeps soooooo much!</h1>')
  next();
})
//can also do app.use with a specified path, not only for ALLLLLLL requests
//runs on every verb on the path the way set up now, i.e. GET, POST, PATCH, etc.

// app.use('/secret', (req, res, next) => {
//   const { password } = req.query;
//   if(password === 'gizmoface') {
//     next();
//   } else {
//     res.send('Password is incorrect');
//   }

// })
//this did work above, but then tweaked below

const verifyPassword = ((req, res, next) => {
  const { password } = req.query;
  if(password === 'gizmoface') {
    next();
  } else {
    res.send('Password is incorrect');
  }
})

app.get('/dogs', verifyPassword, (req, res) => {
  let responseText = 'Gizmo rocks --- ';
  responseText += '<small>Requested at: ' + req.requestTime + '<small>'
  res.send(responseText);
})

app.get('/secret', verifyPassword, (req, res) => {
 const response = 'You have made it through the marshes, lad.';
 res.send(response);
})
//so verifyPassword runs, and since there is a next() in it, then res.send() runs ...
//verifyPassword considered callback here
//so if you want every request to get processed, go with app.use, but if only certain requests, go with callback!!!!!!



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
// can see what he did as well.
// const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });


app.get('/campgrounds/:_id', async (req, res) => {
  const id  = req.params;
  const campground = await Campground.findById(id);
  res.render('campgrounds/show', { campground });
})


app.delete('/campgrounds/:id', async (req, res) => {
  const { id } = req.params;
  const deleteCampground = await Campground.findByIdAndDelete(id);
  res.redirect(`/campgrounds/`)
})

app.use((req, res) => {
  res.status(404).send('<h1>Not Found</h1>')
})
//a catch-all for any route that is not listed above; comes at end, fairly obviously, and for that reason, just as obviouly no need for next()
//in consumer facing app, would have nice 404 template that would be rendered ...

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is open on port ${PORT}`)
})