const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const jwt = require('jsonwebtoken');

// Basic authentication middleware
const authMiddleware = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// GET all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET a specific course by ID
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    console.error('Get course by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST a new course (protected route)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, location, holes } = req.body;
    const totalPar = holes.reduce((sum, hole) => sum + hole.par, 0);

    const newCourse = new Course({
      name,
      location,
      holes,
      totalPar,
      createdBy: req.user.id
    });

    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE a course (protected route)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, location, holes } = req.body;
    const totalPar = holes.reduce((sum, hole) => sum + hole.par, 0);

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if the user is the creator of the course
    if (course.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized to update this course' });
    }

    course.name = name;
    course.location = location;
    course.holes = holes;
    course.totalPar = totalPar;

    await course.save();
    res.json(course);
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE a course (protected route)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if the user is the creator of the course
    if (course.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized to delete this course' });
    }

    await course.remove();
    res.json({ message: 'Course removed' });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;