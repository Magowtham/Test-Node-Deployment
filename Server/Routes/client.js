const routes = require("express").Router();
const addUser = require('../controller/add_user');



module.exports = routes.post('/adduser' , addUser.AddUser);

module.exports = routes;
