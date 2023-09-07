const express = require("express");
const db = require("./config/db");
const PORT = 5000;
const app = express();

//mongodb connection
//middlewares
//routes
app.use(express.json());
app.use("/hardware", require("./Routes/hardware"));
app.use("/client", require("./Routes/client"));
//starting server
app.listen(PORT, () => {
  console.log(`Server Started at ${PORT}`);
});
