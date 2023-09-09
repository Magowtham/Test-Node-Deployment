const addUserModel = require("../models/add_user_model");
const authModel = require("../models/auth_model");
const bcrypt = require("bcrypt");
const mongoose = require('mongoose');

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
      return { status: false, message: "Server Error" }
    }
  }
//Pagination
  static async userPagination(pageStart, pageSize) {
    try {
      const users = await addUserModel
        .find()
        .skip((pageStart - 1) * pageSize)
        .limit(pageSize);
      const totalUsers = await addUserModel.countDocuments();
      return { status: true, totalUsers, users };
    } catch (err) {
      return { status: false, message: "Server Error" }
    }
  }
//Delete the user data
  static async deleteUserData(name, rfid, password) {
    try {
      const data = await addUserModel.findOne({ rfid });
      if (data == null) {
        return { status: false, message: "User Dosen't Exist" };
      }
      else {
        const adminData = await authModel.findOne({ name });
        const isMatch = await bcrypt.compare(password, adminData.password);
        if (!isMatch) {
          return { status: false, message: "Invalid Password" };
        }
        else {
          const userData = await addUserModel.deleteOne({ rfid });
          if (!userData) {
            return { status: false, message: "Unable to delete" };
          } else {
            return { status: true, message: "User Deleted Successfully" };
          }
        }
      }
    } catch (error) {
      return { status: false, message: "Server Error" };
    }
  }

  static async editUserDetails(admin , id , name , rfid , rollnumber , password){
    try {
      const adminData = await authModel.findOne({name: admin});
      const isAdmin = await bcrypt.compare( password , adminData.password );
      if(!isAdmin){
        return {status:false , message:"Incorrect Password"};
      }
      else{
        const userData = await addUserModel.findOne({ _id: new mongoose.Types.ObjectId(id) });
        if(!userData){
          return {status:false , message:"User Not Found"}
        }
        else{
          const myquery = { _id: new mongoose.Types.ObjectId(id) };
          const newvalues = { $set: {name: name, rfid: rfid , rollnumber: rollnumber } };
          await addUserModel.updateOne(myquery, newvalues);
          return {status:true , message:"Updated Successfully"};
        }
      }
    } 
    catch (error) {
      return {status:false , message:"Server Error"};
    }
  }



  static async Recharge(rfid , ammount){
    try {
      const pipeLine = [
        {
          $match: { rfid: rfid },
        },
        {
          $project: {
            _id: 0,
            balance: 1 
          },
        },
      ];
      const [rechargeHistory] = await addUserModel.aggregate(pipeLine);
      console.log(rechargeHistory)
      if(!rechargeHistory){
        return {status:false , message:"User Not Found"}
      }else{
        const now = new Date();
        const currentTime =`${((now.getHours() % 12) || 12).toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} ${now.getHours() >= 12 ? 'PM' : 'AM'}`;
        const currentDate = `${now.getDate().toString().padStart(2, '0')}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getFullYear()}`;
        await addUserModel.updateOne({rfid}, {
          $push: {
            history: {
              ammount: ammount,
              date: currentDate,
              time:currentTime
            },
          },
          $set: {
            balance: parseInt(rechargeHistory.balance) + parseInt( ammount )
          },
        });
        return {status:true , message:"Recharge Successfull"}
      }
    } catch (error) {
      return {status:false , message:"Server Error"}
    }
  }
}

module.exports = UserService;
