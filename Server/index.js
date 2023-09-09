const express = require("express");
const db = require("./config/db");
const cors=require("cors")
const PORT = 9000;
const app = express();

//mongodb connection
//middlewares
app.use(express.json());
app.use(cors({
  origin:"http://localhost:3000"
}))
//routes

app.use("/hardware", require("./Routes/hardware"));
app.use("/client", require("./Routes/client"));
//starting server
app.listen(PORT, () => {
  console.log(`Server Started at ${PORT}`);
});
