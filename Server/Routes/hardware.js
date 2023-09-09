const routes = require("express").Router();
const userModel = require('../controller/user_controller');


routes.post("/recharge" , userModel.rechargeUser);

module.exports = routes;
