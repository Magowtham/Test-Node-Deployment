const routes = require("express").Router();
const userModel = require("../controller/user_controller");

routes.post("/recharge", userModel.rechargeUser);
routes.post("/startCall", userModel.startCall);
routes.post("/endCall", userModel.endCall);

module.exports = routes;
