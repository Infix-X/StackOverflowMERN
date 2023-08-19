// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost/mern-auth', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
app.post('/api/register', async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Check if the username already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }
  
      // Hash the password before saving it
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user
      const newUser = new User({
        username,
        password: hashedPassword,
      });
  
      // Save the user to the database
      await newUser.save();
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  // User login
app.post('/api/login', async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Check if the username exists
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ message: 'Authentication failed' });
      }
  
      // Compare the provided password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Authentication failed' });
      }
  
      // If the password is valid, create a JWT token
      const token = jwt.sign(
        { userId: user._id, username: user.username },
        'your-secret-key', // Replace with a secure secret key
        { expiresIn: '1h' } // Token expiration time
      );
  
      res.status(200).json({ token, userId: user._id, username: user.username });
    } catch (error) {
      console.error('Error logging in user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
