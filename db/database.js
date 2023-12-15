const { MongoClient } = require("mongodb");

let _db;

const database = async() => {
    const client = new MongoClient(process.env.MONGO_DB_URL)
   try {
    await client.connect();
    console.log("Connected to database");
    _db = client.db("images");
   } catch (error) {
    console.error("Error connecting to database:", error);
   }
}

function getDB() {
    return _db;
}

module.exports = { database, getDB };