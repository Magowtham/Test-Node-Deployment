const UserService = require("../services/user_service");

exports.addUser = async (req, res) => {
  try {
    const { name, rfid, rollnumber } = req.body;
    const successUser = await UserService.newUser(name, rfid, rollnumber);
    if (successUser) {
      res.json({ status: true, message: "user registration successfull" });
    } else {
      res.json({ status: false, message: "user already exist" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ status: false, message: "user registration unsuccessfull" });
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
    res.status(500).json({ status: false, message: "unable to find users" });
  }
};



exports.DeleteUser = async (req , res) =>{
  const {name , rfid , password} = req.body;
  const isDelete = await UserService.deleteUserData(name , rfid , password);
  if(!isDelete){
    res.status(400).json(isDelete);
  }else{
    res.status(200).json(isDelete);
  }
}



