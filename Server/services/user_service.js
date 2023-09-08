const addUserModel = require("../models/add_user_model");
const authModel = require("../models/auth_model");
const bcrypt = require("bcrypt");
const mongoose = require('mongoose');

class UserService {
  static async newUser(name, rfid, rollnumber) {
    try {
      const data = await addUserModel.findOne({ rfid });
      if (data == null) {
        const createUser = new addUserModel({ name, rfid, rollnumber });
        await createUser.save();
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw error;
    }
  }
  static async userPagination(pageStart, pageSize) {
    try {
      const users = await addUserModel
        .find()
        .skip((pageStart - 1) * pageSize)
        .limit(pageSize);
      const totalUsers = await addUserModel.countDocuments();
      return { status: true, totalUsers, users };
    } catch (err) {
      throw err;
    }
  }

  static async deleteUserData(name , rfid , password) {
    const data = await addUserModel.findOne({ rfid });
    if (data == null) {
      return { status: false, message: "User Dosen't Exist" };
    }
    else {
      const adminData = await authModel.findOne({ name });
      const isMatch = await bcrypt.compare(password , adminData.password);
      if (!isMatch) {
        return { status: false, message: "Invalid Password" };
      }
      else {
        const userData = await addUserModel.deleteOne({rfid});
        if (!userData) {
          return { status: false, message: "Unable to delete" };
        } else {
          return { status: true, message: "User Deleted Successfully" };
        }
      }
    }

  }
}

module.exports = UserService;
