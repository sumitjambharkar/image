const express = require('express');
const multer  = require('multer');
const path = require('path');
require('dotenv').config()
const fs = require('fs');

const port =  5001 || process.env.PORT

const app = express();

app.use('/uploads', express.static('uploads'));

// Set up Multer to handle file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Directory where uploaded files will be stored
  },
  filename: function (req, file, cb) {
    // Generate a unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.get("/",(req,res)=>{
    res.send("Home")
})
// Handle POST request to upload an image
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No files were uploaded.');
  }

  // Here, you might save the file information to a database
  // Generate a unique URL for the uploaded image
  const imageUrl = `https://show-image.onrender.com/uploads/${req.file.filename}`;
  
  res.send(`Image uploaded successfully. URL: ${imageUrl}`);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
