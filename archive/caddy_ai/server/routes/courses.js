const express = require('express');
const router = express.Router();

// Hardcoded course data
const courses = [
  {
    id: 1,
    name: "Pebble Beach Golf Links",
    location: "Pebble Beach, California",
    holes: [
      { number: 1, par: 4, distance: 380, handicap: 8 },
      { number: 2, par: 5, distance: 502, handicap: 10 },
      { number: 3, par: 4, distance: 390, handicap: 12 },
      // ... add more holes as needed
    ]
  },
  {
    id: 2,
    name: "Augusta National Golf Club",
    location: "Augusta, Georgia",
    holes: [
      { number: 1, par: 4, distance: 445, handicap: 4 },
      { number: 2, par: 5, distance: 575, handicap: 13 },
      { number: 3, par: 4, distance: 350, handicap: 7 },
      // ... add more holes as needed
    ]
  }
  // Add more courses as needed
];

// GET all courses
router.get('/', (req, res) => {
  res.json(courses);
});

// GET a specific course by ID
router.get('/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).json({ message: 'Course not found' });
  res.json(course);
});

module.exports = router;