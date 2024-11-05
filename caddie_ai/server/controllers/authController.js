const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    console.log('Salt generated:', salt);
    console.log('Hashed password during registration:', hashedPassword);

    user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword
    });

    await user.save();
    console.log('User saved to database:', user);

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    console.log('Generated token:', token); // Debug log
    console.log('Payload:', payload); // Debug log

    res.status(201).json({ token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    console.log('User found:', user);
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    console.log('Stored hashed password:', user.password);
    console.log('Provided password:', password);

    console.log('Attempting password comparison');
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);

    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};