const mongoose = require("mongoose");
const dburl = process.env.MongoDB_URL;

const connection = mongoose
  .createConnection(dburl)
  .on("open", () => {
    console.log("MongoDB Connected");
  })
  .on("error", () => {
    console.log("Mongo db connection error");
  });

module.exports = connection;
