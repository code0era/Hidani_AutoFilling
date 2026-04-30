const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Root route for status check
app.get('/', (req, res) => {
  res.send('AutoForm AI Server is running...');
});

// Helpful messages for direct browser access
app.get('/api/auth/login', (req, res) => {
  res.send('Please use the AutoForm AI Extension to login. This is a secure API endpoint.');
});

app.get('/api/auth/register', (req, res) => {
  res.send('Please use the AutoForm AI Extension to register. This is a secure API endpoint.');
});



// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// Models
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const ProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
  data: { type: Object, default: {} },
  lastUpdated: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Profile = mongoose.model('Profile', ProfileSchema);

// Middleware
const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send('Invalid token.');
  }
};

// Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered.');

    user = new User({
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 10)
    });

    await user.save();
    
    // Create empty profile
    const profile = new Profile({ userId: user._id, data: {} });
    await profile.save();

    const token = jwt.sign({ _id: user._id, email: user.email }, process.env.JWT_SECRET);
    res.send({ token });
  } catch (error) {
    res.status(500).send('Server Error: ' + error.message);
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Invalid email or password.');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid email or password.');

    const token = jwt.sign({ _id: user._id, email: user.email }, process.env.JWT_SECRET);
    res.send({ token });
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

app.get('/api/profile', auth, async (req, res) => {
  try {
    console.log(`Fetching profile for user: ${req.user.email}`);
    const profile = await Profile.findOne({ userId: req.user._id });
    res.send(profile ? profile.data : {});
  } catch (error) {
    console.error('Fetch Error:', error);
    res.status(500).send('Server Error');
  }
});

app.post('/api/profile', auth, async (req, res) => {
  try {
    console.log(`Saving profile for user: ${req.user.email}`);
    let profile = await Profile.findOne({ userId: req.user._id });
    if (!profile) {
      profile = new Profile({ userId: req.user._id, data: req.body });
    } else {
      profile.data = req.body;
      profile.lastUpdated = Date.now();
      profile.markModified('data'); // Tell Mongoose the Mixed object changed
    }
    await profile.save();
    console.log('Profile saved successfully');
    res.send(profile.data);
  } catch (error) {
    console.error('Save Error:', error);
    res.status(500).send('Server Error: ' + error.message);
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
