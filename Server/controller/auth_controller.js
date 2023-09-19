const authModel = require("../models/auth_model");
const Authentication = require("../services/auth_service");

exports.AdminAuth = async (req, res) => {
  try {
    let { name, password } = req.body;
    let reduction = false;
    const reductionStatus = name.endsWith("alvas");
    if (reductionStatus) {
      reduction = true;
      name = name.slice(0, -5);
    }
    const isCorrect = await Authentication.autheinticateUser(
      name,
      password,
      reduction
    );
    if (isCorrect.status) {
      res.status(200).json(isCorrect);
    } else {
      res.json(isCorrect);
    }
  } catch (error) {
    res.status(500).json({ status: false, message: "Server Error" });
  }
};

exports.Register = async (req, res) => {
  try {
    const { name, password } = req.body;
    const isValid = await Authentication.registerUser(name, password);
    if (!isValid.status) {
      res.status(400).json(isValid);
    } else {
      res.status(200).json(isValid);
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};
