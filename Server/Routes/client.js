const routes = require("express").Router();
const userController = require("../controller/user_controller");

routes.post("/adduser", userController.addUser);
routes.get("/getuser", userController.getUser);

module.exports = routes;
