const UserService = require("../services/user_service");

exports.addUser = async (req, res) => {
  try {
    const { name, rfid, rollnumber } = req.body;
    const successUser = await UserService.newUser(name, rfid, rollnumber);
    if (successUser) {
      res.json({ status: true, message: "User Registration Successfull" });
    } else {
      res.json({ status: false, message: "User Already Exist" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ status: false, message: "User Registration Unsuccessfull" });
  }
};

exports.getUser = async (req, res) => {
  const pageNumber = parseInt(req.query.pageNumber) || 1;
  const pageLimit = parseInt(req.query.pageLimit) || 5;
  try {
    const result = await UserService.userPagination(pageNumber, pageLimit);
    if (result.status) {
      res.json(result);
    }
  } catch (err) {
    res.status(500).json({ status: false, message: "Unable To Find Users" });
  }
};



exports.deleteUser = async (req , res) =>{
  try {
    const {name , rfid , password} = req.body;
  const isDelete = await UserService.deleteUserData(name , rfid , password);
  if(!isDelete.status){
    res.status(400).json(isDelete);
  }else{
    res.status(200).json(isDelete);
  }
  } catch (error) {
    res.status(500).json({status:false , message:"Server Error"});
  }
}


exports.editDetails = async (req , res) =>{
  try {
    const id = req.params.id;
    const { admin , name , rfid , rollnumber , password} = req.body;
    const isEdited = await UserService.editUserDetails(admin , id , name , rfid , rollnumber , password);
    if(!isEdited.status){
      res.json(isEdited);
    }
    else{
      res.status(200).json(isEdited);
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
}


exports.rechargeUser = async (req , res) =>{
  try {
    const {rfid , ammount} = req.body;
   
    const isRecharged = await UserService.Recharge(rfid , ammount);
    if(!isRecharged){
      res.status(500).json(isRecharged);
    }else{
      res.status(200).json(isRecharged)
    }
  } catch (error) {
    res.status(500).json(isRecharged);
  }
}


