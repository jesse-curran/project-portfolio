const Course = require('../models/Course');

exports.createCourse = async (req, res) => {
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
};

exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getCourseById = async (req, res) => {
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
};