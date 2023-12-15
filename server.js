const express = require("express")
const multer = require("multer")
const { GridFsStorage } = require("multer-gridfs-storage")
const MongoClient = require("mongodb").MongoClient
const GridFSBucket = require("mongodb").GridFSBucket
require("dotenv").config()

const url = process.env.MONGO_DB_URL

const port = process.env.PORT

const mongoClient = new MongoClient(url)

// Create a storage object with a given configuration
const storage = new GridFsStorage({
  url,
  file: (req, file) => {
    //If it is an image, save to photos bucket
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      return {
        bucketName: "photos",
        filename: `${Date.now()}_${file.originalname}`,
      }
    } else {
      //Otherwise save to default bucket
      return `${Date.now()}_${file.originalname}`
    }
  },
})

// Set multer storage engine to the newly created object
const upload = multer({ storage })

const app = express()

app.post("/upload/image", upload.single("image"), (req, res) => {
  const file = req.file
  // Respond with the file details
  res.send({
    message: "Uploaded",
    id: file.id,
    name: file.filename,
    contentType: file.contentType,
  })
})

app.get("/images", async (req, res) => {
  try {
    await mongoClient.connect()

    const database = mongoClient.db("images")
    const images = database.collection("photos.files")
    const cursor = images.find({})
    const count = await cursor.count()
    if (count === 0) {
      return res.status(404).send({
        message: "Error: No Images found",
      })
    }

    const allImages = []

    await cursor.forEach(item => {
      allImages.push(item)
    })

    res.send({ files: allImages })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message: "Error Something went wrong",
      error,
    })
  }
})

app.get("/download/:filename", async (req, res) => {
  try {
    await mongoClient.connect()

    const database = mongoClient.db("images")

    const imageBucket = new GridFSBucket(database, {
      bucketName: "photos",
    })

    let downloadStream = imageBucket.openDownloadStreamByName(
      req.params.filename
    )

    downloadStream.on("data", function (data) {
      return res.status(200).write(data)
    })

    downloadStream.on("error", function (data) {
      return res.status(404).send({ error: "Image not found" })
    })

    downloadStream.on("end", () => {
      return res.end()
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message: "Error Something went wrong",
      error,
    })
  }
})
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
