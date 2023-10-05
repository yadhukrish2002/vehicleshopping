const express=require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
var mongoose=require('mongoose');

const otp=require('./phoneotp')
const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/vehicle_project', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});
// Create a User schema and model
const UserSchema = new mongoose.Schema({
  email:{ type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  city: { type: String, required: false },
  state: { type: String, required: false },
  country: { type: String, required: true },
  pincode: { type: Number, required: false },
  phoneno: { type: Number, required: true },
});
//access collection from the database
const User = mongoose.model('users', UserSchema);



// Phone verification
// Send a verification code to the provided phone number
const verificationCodes = new Map();
app.post('/send-verification-code', (req, res) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber) {
    return res.status(400).json({ success: false, message: 'Phone number is required' });
  }
  const verificationCode = otp.generateVerificationCode();
  verificationCodes.set(phoneNumber, verificationCode);
  // Send verification code via Twilio
  otp.sendVerificationCode(phoneNumber, verificationCode);
  res.json({ success: true, message: 'Verification code sent successfully' });
});

// Verify the provided verification code
app.post('/verify-phone-number', (req, res) => {
  const { phoneNumber, verificationCode } = req.body;
  if (!phoneNumber || !verificationCode) {
    return res.status(400).json({ success: false, message: 'Phone number and verification code are required' });
  }
  const storedCode = verificationCodes.get(phoneNumber);
  if (!storedCode || parseInt(verificationCode) !== storedCode) {
    return res.json({ success: false, message: 'Invalid verification code' });
  }
  // Clear the verification code from the store after successful verification
  verificationCodes.delete(phoneNumber);
  res.json({ success: true, message: 'Phone number verified' });
});

//api for Admin login
app.post('/adminlogin', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if the provided password matches the stored password (plaintext comparison)
    if (password === "admin" && email==="admin@gmail.com") {
      // Passwords match; you can consider the user authenticated
      res.status(200).json({ message: 'Admin login successful' });
    } else {
      // Passwords don't match; return an error
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during sign-in:', error);
    res.status(500).json({ message: 'Sign-in failed' });
  }
});

//api for user login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find the user by email
    const user = await User.findOne({ email });
    // If the user doesn't exist, return an error
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // Check if the provided password matches the stored password (plaintext comparison)
    if (password === user.password) {
      // Passwords match; you can consider the user authenticated
      res.status(200).json({ message: 'User login successful' });
    } else {
      // Passwords don't match; return an error
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during sign-in:', error);
    res.status(500).json({ message: 'Sign-in failed' });
  }
});
// api for signup
app.post('/signup', async (req, res) => {
  const { name, email, password, cPassword, city, state, country, pinCode, phoneNumber } = req.body;
  // Check if any required field is missing
  if (!name || !email || !password || !cPassword || !city || !state || !country || !pinCode || !phoneNumber) {
    return res.status(400).json({ success: false, message: 'Please fill in all required fields' });
  }
  // Check if the password and confirm password match
  if (password !== cPassword) {
    return res.status(400).json({ success: false, message: 'Passwords do not match' });
  }
  try {
    // Create a new user object
    const newUser = new User({name:name,email:email,password:password,city:city,state:state,country:country,pincode:pinCode,pphoneNumber,});
    // Save the user to the database
    await newUser.save();
    res.json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ success: false, message: 'Error registering user' });
  }
});




app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });