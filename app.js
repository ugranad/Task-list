const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
var exphbs = require('express-handlebars');
const morgan = require('morgan');
const methodOverride = require('method-override');


//Load routes
const tasks = require('./routes/tasks');
const users = require('./routes/users');

//Passport config
require('./config/passport')(passport);


const app = express();
const port = 8000;

mongoose.connect('mongodb://localhost:27017/task', { useNewUrlParser: true })
  .then(re => console.log('Connected to task DB...'))
  .catch(err => console.log(err));




// BodyParser MiddleWare
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// MethodOverride MiddleWare
app.use(methodOverride('_method'));

//Express-session MiddleWare
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

//Passport MiddleWare (always below express-session)
app.use(passport.initialize());
app.use(passport.session());

// Connect-flash MiddleWare
app.use(flash());


//Global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null // To hide/show login and register in client side
  next();

})

// Morgan MiddleWare
app.use(morgan('dev'));

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


//About route
app.get('/about', (req, res) => {
  res.render('about')
});




//Use Routes
app.use('/tasks', tasks);
app.use('/users', users);



app.listen(port, () => console.log(`Server is running on port ${port}`))