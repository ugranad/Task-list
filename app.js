const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
var exphbs = require('express-handlebars');


const app = express();
const port = 8000;

mongoose.connect('mongodb://localhost:27017/task', { useNewUrlParser: true })
  .then(re => console.log('Connected to task DB...'))
  .catch(err => console.log(err));

// BodyParser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Express-Handlebars middleware
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');


// Index route
app.get('/', (req, res) => {
  const title = 'Welcome'
  res.render('index', {
    title
  })
})

app.get('/about', (req, res) => {
  res.render('about')
})






app.listen(port, () => console.log(`Server is running on port ${port}`))