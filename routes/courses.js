const express = require('express');
const {
  getCourses,
  getCourse,
  addCourse,
  deleteCourse,
  updateCourse
} = require('../controllers/courses');

const Bootcamp = require('../models/Bootcamp');
const Course = require('../models/Course');
const advancedResults = require('../middleware/advancedResults');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(
    advancedResults(Course, {
      path: 'bootcamp',
      select: 'name description',
      model: Bootcamp
    }),
    getCourses
  )
  .post(addCourse);

router
  .route('/:id')
  .get(getCourse)
  .put(updateCourse)
  .delete(deleteCourse);

module.exports = router;
