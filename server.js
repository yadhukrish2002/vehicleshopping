const express=require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const stripe=require('stripe')('sk_test_51NyUPwSIA5A0K9CNU9CAT2bgPqco5nJOsDla4JT21w5HUufi1tgiPtE2RH0hQdG39lpbPjIFWTa1aeLW9BsQ6xcI00291FX4Np')
var mongoose=require('mongoose');
const uuid=require('uuid').v4
const multer = require('multer');
const path = require('path');
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
const VehicleSchema =new mongoose.Schema({
  name: String,
  description: String,
  price:String,
  image: String,
  noofvehicle: Number,
})
const AdminSchema=new mongoose.Schema({
  email:{ type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
  photo:{ type:String},

})
//access collection from the database
const User = mongoose.model('users', UserSchema);
const Vehicle=mongoose.model('vehicles',VehicleSchema);
const Admin=mongoose.model('admins',AdminSchema);
// Set up storage for image uploads using Multer

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({
  storage: storage,
});

// Add a new vehicle to the database
app.post('/addvehicle', upload.single('vimage'), async (req, res) => {
  try {
    const { vname, vdescription,vprice, noofvehicle } = req.body;

    // Construct the image path on your server
    const vimagePath = req.file.filename;

    // Create a new vehicle object
    const newVehicle = new Vehicle({
      name: vname,
      description: vdescription,
      price:vprice,
      image: vimagePath,
      noofvehicle: noofvehicle,
    });

    // Save the new vehicle to the database
    await newVehicle.save();

    res.status(200).json({ message: 'Vehicle added successfully' });
  } catch (error) {
    console.error('Error adding vehicle:', error);
    res.status(500).json({ message: 'Error adding vehicle' });
  }
});
// Serve images
app.get('/image/:filename', (req, res) => {
  const { filename } = req.params;
  console.log(filename);
  const imagePath = path.join(__dirname, './uploads', filename);
  console.log('Sending image:', imagePath);
  res.sendFile(imagePath);
});
// Fetch all vehicles from the database
app.get('/vehicles', async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.status(200).json(vehicles);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({ message: 'Error fetching vehicles' });
  }
});
// Delete a vehicle by ID
app.delete('/deletevehicle/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await Vehicle.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    res.status(500).json({ message: 'Error deleting vehicle' });
  }
});
// Update a vehicle by ID
app.put('/updatevehicle/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description,price, noofvehicle } = req.body;

    // Find the vehicle by ID in the database
    const vehicle = await Vehicle.findById(id);

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Update the vehicle properties
    vehicle.name = name;
    vehicle.description = description;
    vehicle.price=price;
    vehicle.noofvehicle = noofvehicle;

    // Save the updated vehicle to the database
    await vehicle.save();

    res.status(200).json({ message: 'Vehicle updated successfully' });
  } catch (error) {
    console.error('Error updating vehicle:', error);
    res.status(500).json({ message: 'Error updating vehicle' });
  }
});



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
    // Find the user by email
    const admin = await Admin.findOne({ email });
    // If the user doesn't exist, return an error
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // Check if the provided password matches the stored password (plaintext comparison)
    if (password === admin.password) {
      // Passwords match; you can consider the user authenticated
      res.status(200).json({ message: 'Admin login successful' });
    } else {
      // Passwords don't match; return an error
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during admin sign-in:', error);
    res.status(500).json({ message: 'Sign-in failed' });
  }
});

// Fetch all vehicles from the database
app.get('/admins', async (req, res) => {
  try {
    const admin = await Admin.find();
    res.status(200).json(admin);
  } catch (error) {
    console.error('Error fetching Admins:', error);
    res.status(500).json({ message: 'Error fetching Admins' });
  }
});

// Route to update an admin's profile
app.put("/editprofile/:id", upload.single("photo"),async (req, res) => {
  try{
    const { id } = req.params;
    const { name, email, password } = req.body;
    const photopath =req.file.filename;
    console.log(name,email,password,photopath);

    const admin = await Admin.findById(id);
    if (!Admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    // Update the Admin properties
    admin.name = name;
    admin.email = email;
    admin.password=password;
    admin.photo = photopath;

    // Save the updated vehicle to the database
    await admin.save();

    res.status(200).json({ message: 'admin profile updated successfully' });
  } catch (error) {
    console.error('Error updating admin:', error);
    res.status(500).json({ message: 'Error updating admin' });
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
    const newUser = new User({name:name,email:email,password:password,city:city,state:state,country:country,pincode:pinCode,phoneno:phoneNumber,});
    // Save the user to the database
    await newUser.save();
    res.json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ success: false, message: 'Error registering user' });
  }
});

//payment
app.post('/checkout',async(req,res)=>{
  console.log(req.body)
});



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });