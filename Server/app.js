const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
//mongodb connection
require("./config/db");
//middlewares
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
//main routes
app.use("/hardware", require("./Routes/hardware"));
app.use("/client", require("./Routes/client"));
//starting server
app.listen(PORT, () => {
  console.log(`Server Started at ${PORT}`);
});
