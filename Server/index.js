const express = require("express");
const cors = require("cors");
const PORT = 9000;
const app = express();

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
