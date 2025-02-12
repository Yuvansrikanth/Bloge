const { Router } = require("express");
const fs = require('fs');
const path = require('path');
const User = require('../models/user');
const router = Router();


// Middleware to decode Base64
const decodeBase64Image = (req, res, next) => {
  const base64Image = req.body.image; // Base64 data sent from the client
  const matches = base64Image.match(/^data:image\/(\w+);base64,(.+)$/);

  const imageType = matches[1]; // e.g., "png" or "jpeg"
  const imageData = matches[2]; // Base64 image content

  // Decode Base64 and create a buffer
  const imageBuffer = Buffer.from(imageData, "base64");

  // Create a temporary file-like object for Multer
  req.file = {
    buffer: imageBuffer,
    filename: `${Date.now()}-croppedImage.${imageType}`,
  };

  next();
};

router.post('/edit-profile-image', decodeBase64Image, async (req, res) => {
  const user = await User.findById(req.user._id);
  console.log(req.file);
    if (user.profileImageURL != "/images/default.png")
    {   
      const oldImagePath = path.join(__dirname, '..', 'public', user.profileImageURL);
      //delete old image
      if (fs.existsSync(oldImagePath))
      {
        fs.unlink(oldImagePath, (err) => {
          console.log(oldImagePath);
            if (err) {
              console.log('Error deleting old image:', err);
            } else {
              console.log('Old image deleted successfully');
            }
          });
      }
    }
    const newFilePath = path.join(__dirname, '..', 'public','uploads','profile-Images',`${req.file.filename}`);
    console.log(newFilePath);
    fs.writeFileSync(newFilePath, req.file.buffer);
    if (req.file) {
      const newProfileImagePath = `/uploads/profile-Images/${req.file.filename}`
      user.profileImageURL = newProfileImagePath;
      await user.updateOne({ profileImageURL: newProfileImagePath }); 
      res.status(200).json({ success: true, redirect: `/user/profile/${user._id}` });
    }
    else res.status(500).json({ success: false, message: "Internal server error." });
});

router.post('/edit-profile-data', async (req, res) => {
  const user = await User.findById(req.user._id);
    const profile_name = req.body.fullName;
    await user.updateOne({ fullName: profile_name }); 
    res.redirect(`/user/profile/${user._id}`);
});


module.exports = router;