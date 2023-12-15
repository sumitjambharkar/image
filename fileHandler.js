const fs = require("fs");
const { getDB } = require("./db/database");
const { GridFSBucket } = require("mongodb");

async function uploadFile(file) {
  const filePath = file.path;
  const db = getDB();
  const bucket = new GridFSBucket(db);

  return new Promise((resolve, reject) => {
    const uploadStream = bucket.openUploadStream(file.originalname);
    const readStream = fs.createReadStream(filePath);

    readStream.pipe(uploadStream)
      .on('error', (error) => {
        reject(error);
      })
      .on('finish', () => {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.log("Error deleting uploaded file:", err);
          }
          console.log("Uploaded file deleted from server.");
        });
        resolve("File uploaded successfully");
      });
  });
}

async function getFileByName(filename) {
  const db = getDB();
  const bucket = new GridFSBucket(db);
  const file = await db.collection('fs.files').findOne({ filename });

  if (!file) {
    throw new Error("File not found");
  }

  const downloadStream = bucket.openDownloadStreamByName(filename);
  return downloadStream;
}

module.exports = { uploadFile, getFileByName };
