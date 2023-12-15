const { uploadFile, getFileByName } = require("../fileHandler");


const uploadImage = async(req,res)=> {
    try {
        const file = req.file;
        if (!file) {
          return res.status(400).send("No file uploaded.");
        }
    
        await uploadFile(file);
        return res.status(200).send("File uploaded successfully.");
      } catch (error) {
        console.error("Error uploading file:", error);
        return res.status(500).send("Server error.");
      }
}

const showImage = async (req, res) => {
    try {
      const filename = req.params.filename;
      const downloadStream = await getFileByName(filename);
      downloadStream.pipe(res);
    } catch (error) {
      console.error("Error fetching file:", error);
      res.status(404).send("File not found");
       }  
     }

module.exports = {uploadImage,showImage}