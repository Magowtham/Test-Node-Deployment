const routes = require("express").Router();
const userController = require("../controller/user_controller");
const authController = require("../controller/auth_controller");

routes.post("/adduser", userController.addUser);
routes.get("/getuser", userController.getUser);
routes.post("/auth" , authController.AdminAuth);
routes.post("/register" , authController.Register);
routes.post("/delete" , userController.DeleteUser);

module.exports = routes;
