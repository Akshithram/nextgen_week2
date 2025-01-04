const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Database connection
mongoose
  .connect('mongodb://localhost:27017/adminPanel', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Mongoose Schema
const ItemSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
});

const Item = mongoose.model('Item', ItemSchema);

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// API route to add items
app.post('/api/admin/add', upload.single('image'), async (req, res) => {
  try {
    const newItem = new Item({
      title: req.body.title,
      description: req.body.description,
      image: `/uploads/${req.file.filename}`,
    });

    await newItem.save();
    res.status(200).json({ message: 'Item added successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Error adding item', error: err });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
