const addUserModel = require("../models/add_user_model");
const authModel = require("../models/auth_model");
const currentDateTime = require("./date");
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
        return { status: true, exisist: false, message: "Successfull" };
      } else {
        return {
          status: false,
          exisist: true,
          message: "RFID Already Exists",
        };
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
        const userData = await addUserModel.findOne(
          {
            _id: new mongoose.Types.ObjectId(id),
          },
          { _id: 0, rfid: 1 }
        );
        if (!userData) {
          return { status: false, message: "User Not Found" };
        } else {
          const userObject = await addUserModel.find(
            { rfid },
            { rfid: 1, _id: 1 }
          );

          if (userObject.length !== 0 && userObject[0]?._id?.valueOf() !== id) {
            return { status: false, message: "RFID Already Exists" };
          }
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
        const { currentTime, currentDate } = currentDateTime();
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
              balance: rechargeHistory.balance + parseInt(amount),
            },
          }
        );
        return { status: true, message: "Recharge Successfull" };
      }
    } catch (error) {
      throw error;
    }
  }

  static async rechargePagination(rfid, pageStart, pageSize, reductionStatus) {
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
        if (Number(reductionStatus)) {
          result?.historySlice.forEach((element) => {
            element.amount =
              Number(element.amount) - Number(element.amount) * 0.6;
          });
        }
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

  static async expenseHistoryPagination(rfid, pageStart, pageSize) {
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
                `$expenseHistory`,
                parseInt(pageStart * pageSize),
                parseInt(pageSize),
              ],
            },
            rechargeHistoryLength: {
              $size: "$expenseHistory",
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
        return { status: false, message: "No Results Found" };
      } else {
        return { status: true, users: results };
      }
    } catch (error) {
      throw error;
    }
  }
  static async getBalance(rfid) {
    try {
      const dbResult = await addUserModel.findOne(
        { rfid },
        { balance: 1, _id: 0 }
      );
      console.log(dbResult);
      if (!dbResult) {
        return { status: false, message: "User Not Exists" };
      }
      const { currentDate, currentTime } = currentDateTime();
      await addUserModel.updateOne(
        { rfid },
        {
          $push: {
            expenseHistory: {
              $each: [
                {
                  date: currentDate,
                  callStartTime: currentTime,
                  callEndTime: "Call Started",
                  reductedAmount: 0,
                },
              ],
              $position: 0,
            },
          },
        }
      );
      return { status: true, balance: dbResult?.balance };
    } catch (error) {
      throw error;
    }
  }

  static async setBalance(rfid, reductedBalance) {
    try {
      const dbResult = await addUserModel.findOne(
        { rfid },
        { balance: 1, _id: 0 }
      );
      if (!dbResult) {
        return { status: false, message: "User Not Exists" };
      }
      console.log(reductedBalance);
      await addUserModel.updateOne(
        { rfid },
        {
          $set: {
            [`expenseHistory.0.callEndTime`]: currentDateTime().currentTime,
            [`expenseHistory.0.reductedAmount`]:
              Number(dbResult?.balance) - reductedBalance,
            balance: reductedBalance,
          },
        }
      );
      return { status: true, message: "Balance Amount Updated Successfully" };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserService;
