const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const cors = require('cors');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');

const generateSecretKey = () => {
  return crypto.randomBytes(64).toString('hex');
};

// Use the generated secret key for express-session configuration
const secretKey = generateSecretKey();

const app = express();
app.use(cookieParser());
const PORT = 5000;

mongoose.connect('mongodb://localhost:27017/NEWSDESK')
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());



// Signup endpoint
app.post('/signup', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists.' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({ firstName, lastName, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Error creating user.' });
  }
});


// Login endpoint
const JWT_SECRET = 'mysecretkey123';

// Login endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    
    res.cookie('sessionId', token, { httpOnly: true, sameSite: 'strict', maxAge: 3600000 }); // 1 hour expiry

    res.json({ message: 'Login successful!', token, user: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName } });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in.' });
  }
});

//reset password
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mshahabaliyousaf414@gmail.com',  // Your email
    pass: 'fihg nvcr xjpf rwef'          // Your password
  }
});

// Password Reset endpoint
// Password Reset endpoint
const jwt = require('jsonwebtoken');

// Password Reset endpoint
app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User not found.' });
    }

    const token = jwt.sign({ userId: user._id }, 'sa1212wkcs23cdvrks4kn(34xcxcx', { expiresIn: '1h' });
    
    const resetLink = `http://localhost:3000/reset-password/${token}`;
    
    const mailOptions = {
      from: 'mshahabaliyousaf414@gmail.com',
      to: email,
      subject: 'Password Reset Link',
      text: `Click on the link to reset your password: ${resetLink}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ error: 'Failed to send reset email.' });
      }
      console.log('Email sent: ' + info.response);
      res.status(200).json({ message: 'Reset email sent successfully!' });
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error processing request.' });
  }
});


//reset password update
// Update Password endpoint
app.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const decodedToken = jwt.verify(token, 'sa1212wkcs23cdvrks4kn(34xcxcx');
    const userId = decodedToken.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ error: 'User not found.' });
    }

    // Update user's password
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully!' });

  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(400).json({ error: 'Invalid or expired token.' });
    }
    console.log(error); // Log other errors for debugging
    res.status(500).json({ error: 'Error updating password.' });
  }
});



// Profile endpoint
const verifyToken = (req, res, next) => {
  const token = req.cookies.sessionId;

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId; // Attach user ID to request object for use in other middleware or route handlers
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

// Apply the middleware to the profile endpoint
app.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId); // Using the userId attached to the request object

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({ message: 'Welcome to your profile!', user: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName } });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Error fetching profile.' });
  }
});



// Generate delete token endpoint
app.post('/generate-delete-token', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    
    // If user does not exist
    if (!user) {
      return res.status(400).json({ error: 'User not found.' });
    }

    const deleteToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    
    const deleteLink = `http://localhost:3000/delete-account/${deleteToken}`;
    
    const mailOptions = {
      from: 'mshahabaliyousaf414@gmail.com',
      to: email,
      subject: 'Account Deletion Link',
      text: `Click on the link to delete your account: ${deleteLink}`
    };

    // Attempt to send the deletion email
    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ error: 'Failed to send deletion email. Please try again later.' });
      }
      res.status(200).json({ message: 'Deletion email sent successfully!' });
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error processing request. Please try again later.' });
  }
});

// Delete account endpoint
app.get('/delete-account/:deleteToken', async (req, res) => {
  const { deleteToken } = req.params;

  try {
    // Verify and decode the deleteToken
    const decodedToken = jwt.verify(deleteToken, JWT_SECRET);
    const userId = decodedToken.userId;

    // Find the user by ID
    const user = await User.findById(userId);
    
    // If user not found
    if (!user) {
      return res.status(400).json({ error: 'User not found. Maybe the account was already deleted or the token is invalid.' });
    }

    // Delete the user from the database
    await User.findByIdAndDelete(userId);
    
    // Return success message
    res.status(200).json({ message: 'Account deleted successfully!' });

  } catch (error) {
    // Handle token-related errors
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(400).json({ error: 'Invalid or expired token. Please generate a new deletion token.' });
    }
    
    // Log other errors for debugging
    console.log(error);
    
    // Return generic error message
    res.status(500).json({ error: 'Error deleting account. Please try again later.' });
  }
});




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});