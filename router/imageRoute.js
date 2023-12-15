const express = require("express")
const router = express.Router()
const imageController = require("../controller/imageController")
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads');
    },
    filename: function (req, file, cb) {
      cb(null, (new Date().getTime()) + "-" + file.originalname);
    }
});
  
const upload = multer({ storage: storage });

router.post("/upload",upload.single('image'),imageController.uploadImage)
router.get("/upload/:filename",imageController.showImage)

module.exports = router