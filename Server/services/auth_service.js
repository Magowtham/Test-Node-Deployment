const authModel = require("../models/auth_model");

const bcrypt = require("bcrypt");

class Authentication {
  static async autheinticateUser(name, password, reduction) {
    try {
      const names = await authModel.findOne({ name });
      if (names === null) {
        return { status: false, message: "Admin Dose'nt Exist" };
      } else {
        const isMatch = await bcrypt.compare(password, names.password);
        if (!isMatch) {
          return { status: false, message: "Incorrect Password" };
        } else {
          return { status: true, admin: names.name, reduction };
        }
      }
    } catch (error) {}
  }
  static async registerUser(name, password) {
    const names = await authModel.findOne({ name });
    if (names === null) {
      const addUser = new authModel({ name, password });
      await addUser.save();
      return { status: true, message: "User Created Successfully" };
    } else {
      return { status: false, message: "User Already Exit" };
    }
  }
}

module.exports = Authentication;
