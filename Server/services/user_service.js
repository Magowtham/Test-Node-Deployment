const addUserModel = require("../models/add_user_model");
const authModel = require("../models/auth_model");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

class UserService {
  //Add New Users
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
  //Pagination
  static async userPagination(pageStart, pageSize) {
    try {
      const users = await addUserModel
        .find()
        .skip(pageStart * pageSize)
        .limit(pageSize);
      const totalUsers = await addUserModel.countDocuments();
      return { status: true, totalUsers, users };
    } catch (error) {
      throw error;
    }
  }
  //Delete the user data
  static async deleteUserData(name, rfid, password) {
    try {
      const data = await addUserModel.findOne({ rfid });
      if (data == null) {
        return { status: false, message: "User Dosen't Exist" };
      } else {
        const adminData = await authModel.findOne({ name });
        const isMatch = await bcrypt.compare(password, adminData.password);
        if (!isMatch) {
          return { status: false, message: "Invalid Password" };
        } else {
          const userData = await addUserModel.deleteOne({ rfid });
          if (!userData) {
            return { status: false, message: "Unable to delete" };
          } else {
            return { status: true, message: "User Deleted Successfully" };
          }
        }
      }
    } catch (error) {
      throw error;
    }
  }

  static async editUserDetails(admin, id, name, rfid, rollnumber, password) {
    try {
      const adminData = await authModel.findOne({ name: admin });
      if (!adminData) {
        return { status: false, message: "Unauthorised Admin" };
      }
      const isAdmin = await bcrypt.compare(password, adminData.password);
      if (!isAdmin) {
        return { status: false, message: "Incorrect Password" };
      } else {
        const userData = await addUserModel.findOne({
          _id: new mongoose.Types.ObjectId(id),
        });
        if (!userData) {
          return { status: false, message: "User Not Found" };
        } else {
          const myquery = { _id: new mongoose.Types.ObjectId(id) };
          const newvalues = {
            $set: { name: name, rfid: rfid, rollnumber: rollnumber },
          };
          await addUserModel.updateOne(myquery, newvalues);
          return { status: true, message: "Updated Successfully" };
        }
      }
    } catch (error) {
      throw error;
    }
  }

  static async Recharge(rfid, amount) {
    try {
      const pipeLine = [
        {
          $match: { rfid: rfid },
        },
        {
          $project: {
            _id: 0,
            balance: 1,
          },
        },
      ];
      const [rechargeHistory] = await addUserModel.aggregate(pipeLine);
      if (!rechargeHistory) {
        return { status: false, message: "User Not Found" };
      } else {
        const now = new Date();
        const currentTime = `${(now.getHours() % 12 || 12)
          .toString()
          .padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")} ${
          now.getHours() >= 12 ? "PM" : "AM"
        }`;
        const currentDate = `${now.getDate().toString().padStart(2, "0")}-${(
          now.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}-${now.getFullYear()}`;
        await addUserModel.updateOne(
          { rfid },
          {
            $push: {
              rechargeHistory: {
                $each: [{ date: currentDate, time: currentTime, amount }],
                $position: 0,
              },
            },
            $set: {
              balance: parseInt(rechargeHistory.balance) + parseInt(amount),
            },
          }
        );
        return { status: true, message: "Recharge Successfull" };
      }
    } catch (error) {
      throw error;
    }
  }

  static async rechargePagination(rfid, pageStart, pageSize) {
    try {
      const pipeLine = [
        {
          $match: {
            rfid,
          },
        },
        {
          $project: {
            _id: 0,
            historySlice: {
              $slice: [
                `$rechargeHistory`,
                parseInt(pageStart * pageSize),
                parseInt(pageSize),
              ],
            },
            rechargeHistoryLength: {
              $size: "$rechargeHistory",
            },
          },
        },
      ];
      const [result] = await addUserModel.aggregate(pipeLine);
      if (!result) {
        return { status: false, message: "User Not Found" };
      } else {
        return {
          status: true,
          history: result?.historySlice,
          historyLength: result?.rechargeHistoryLength,
        };
      }
    } catch (error) {
      throw error;
    }
  }
  static async search(query) {
    try {
      const results = await addUserModel.find(
        {
          $or: [
            {
              rfid: { $regex: `^${query}`, $options: "i" },
            },
            {
              name: { $regex: `^${query}`, $options: "i" },
            },
            {
              rollnumber: { $regex: `^${query}`, $options: "i" },
            },
          ],
        },
        { name: 1, rfid: 1, rollnumber: 1, balance: 1, _id: 0 }
      );
      if (results.length === 0) {
        return { status: false, message: "No Users Found" };
      } else {
        return { status: true, users: results };
      }
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserService;
