const express = require("express");
const imageRoute = require("./router/imageRoute");
const { database } = require("./db/database");
require("dotenv").config()

const app = express();
const port = process.env.PORT
database();
app.use("/", imageRoute);

app.listen(port, () => {
  console.log("Server Started");
});
