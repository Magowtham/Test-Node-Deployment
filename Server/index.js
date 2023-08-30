const express = require("express");
const mongoose = require("mongoose");
const PORT = 5000;
const app = express();

//mongodb connection
mongoose
  .connect("mongodb://127.0.0.1:27017/TelephoneDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((err) => {
    throw new Error(`Error occured while connecting to MongoDB  ${err}`);
  });

//middlewares
//routes
app.use("/hardware", require("./Routes/hardware"));
app.use("/client", require("./Routes/client"));
//starting server
app.listen(PORT, () => {
  console.log(`Server Started at ${PORT}`);
});
