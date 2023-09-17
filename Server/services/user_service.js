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
        return { status: false, message: "No Results Found" };
      } else {
        return { status: true, users: results };
      }
    } catch (error) {
      throw error;
    }
  }
  static usersHistory = [];
  static intervalTime = 3000;
  static async amountDeducter(index, rfid, res) {
    const timer = setInterval(() => {
      if (this.usersHistory[index].balance < 10) {
        res
          .status(200)
          .json({ status: false, message: "Insufficient Balance" });
      }
      this.usersHistory[index].balance -= 1;
      console.log(this.usersHistory[index].balance);
    }, this.intervalTime);
    this.usersHistory[index].timerId = timer[Symbol.toPrimitive]();
  }
  static async startAmountReducter(rfid, res) {
    try {
      const dbResult = await addUserModel.findOne(
        { rfid },
        { balance: 1, _id: 0 }
      );
      console.log(dbResult);
      if (!dbResult) {
        return { status: false, message: "User Not Exists" };
      }

      if (Number(dbResult.balance) < 10) {
        return { status: false, message: "Insufficeint Balance" };
      }
      const { currentDate, currentTime } = currentDateTime();
      this.usersHistory.push({
        date: currentDate,
        callStartTime: currentTime,
        balance: Number(dbResult.balance),
      });
      this.amountDeducter(this.usersHistory.length - 1, rfid, res);
      return { status: true, ID: this.usersHistory.length - 1 };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async dial(rfid) {
    try {
      const historyResult = this.usersHistory.filter(
        (user) => user.rfid === rfid
      );
      if (historyResult.length === 0) {
        const dbResult = await addUserModel.findOne(
          { rfid },
          { balance: 1, _id: 0 }
        );
        if (!dbResult) {
          return { status: false, message: "User Not Exists" };
        }
        if (Number(dbResult.balance) < 10) {
          return { status: false, message: "Insufficeint Balance" };
        }
        this.usersHistory.push({
          rfid,
          balance: Number(dbResult.balance),
          currentDate: currentDateTime().currentDate,
          callStartTime: currentDateTime().currentTime,
        });
        const timeId = setInterval(() => {
          this.usersHistory[this.usersHistory.length - 1].balance -= 1;
          this.usersHistory;
          console.log(this.usersHistory);
        }, this.intervalTime);
        this.usersHistory[this.usersHistory.length - 1].timerId =
          timeId[Symbol.toPrimitive]();
        return { status: true, message: "Call started" };
      } else {
        // const dbResult = await addUserModel.updateOne(
        //   { rfid: historyResult[0].rfid },
        //   {
        //     $push: {
        //       expenseHistory: {
        //         $each: [
        //           {
        //             date: historyResult[0].currentDate,
        //             callStartTime: historyResult[0].callStartTime,
        //             callEndTime: currentDateTime().currentTime,
        //           },
        //         ],
        //         $position: 0,
        //       },
        //     },
        //     $set: { balance: this.historyResult[].balance },
        //   }
        // );
      }
    } catch (error) {
      console.log(error);
      // throw error;
    }
  }
}

module.exports = UserService;