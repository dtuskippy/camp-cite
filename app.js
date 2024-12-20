const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const path = require('path');



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('home');
})

app.listen(PORT, () => {
  console.log(`Server is open on port ${PORT}`)
})