const express = require('express');
const mongoose = require('mongoose')
const router = express.Router();
const { ensureAuthenticated } = require('../helpers/auth');



//load  tasks model
require('../model/task');
const Task = mongoose.model('tasks')



//Task Index Page
router.get('/', ensureAuthenticated, (req, res) => {
  Task.find({ user: req.user.id }) // To get the task list of individual user
    .sort({ date: 'desc' })
    .then(tasks => {
      res.render('tasks/index', {
        tasks
      });

    })
})


//Add tasks form
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('tasks/add')
});

//Edit task form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Task.findOne({
    _id: req.params.id
  })
    .then(task => {
      if (task.user != req.user.id) { //authenticate user before editing the list
        req.flash('error_msg', 'Unauthorized');
        res.redirect('/tasks');
      } else {
        res.render('tasks/edit', {
          task
        })
      }

    })
});


//Process Form 
router.post('/', ensureAuthenticated, (req, res) => {
  console.log(req.body);
  let errors = []

  if (!req.body.title) {
    errors.push({ msg: 'Please add title' });
  }
  if (!req.body.details) {
    errors.push({ msg: 'Please add some details' });
  }

  if (errors.length > 0) {
    res.render('/add', {
      errors,
      title: req.body.title,
      details: req.body.details
    })
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details,
      user: req.user.id // To set separate list for individual users
    }
    new Task(newUser)//required from model schema
      .save()
      .then(task => {
        req.flash('success_msg', 'Task added')

        res.redirect('/tasks');
      })
      .catch(err => console.log(err));
  }
})


//Edit form process
router.put('/:id', ensureAuthenticated, (req, res) => {
  Task.findOne({
    _id: req.params.id
  })
    .then(task => {
      //new Values
      task.title = req.body.title;
      task.details = req.body.details;

      task.save()
        .then(task => {
          req.flash('success_msg', 'Task updated')

          res.redirect('/tasks')
        })
    })
})

//Delete task 
router.delete('/:id', ensureAuthenticated, (req, res) => {
  Task.remove({ _id: req.params.id })
    .then(() => {
      req.flash('success_msg', 'Task removed')
      res.redirect('/tasks')
    })
})








module.exports = router;