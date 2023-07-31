const express = require("express");

const port = 5000;
const app = express();
app.get("/test", (req, res) => {
  console.log("request recivied");
  res.json({
    message: "first node js deployment successfull",
  });
});

app.listen(port, function () {
  console.log(`Server started at port : ${port}`);
});
