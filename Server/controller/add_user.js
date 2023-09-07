const UserService = require('../services/add_user_service');


exports.AddUser = async (req , res) =>{
    try {
        const {name , rfid , rollnumber} = req.body;
        const successUser = await UserService.newUser(name , rfid , rollnumber);
        if(successUser){
            res.json({status:true , success:"user registration successfull"});
        }else{
            res.json({status:false , success:"user already exist"})
        }
        
    } catch (error) {
        console.log(error.message)
        res.status(400).json({status:false , success:"user registration unsuccessfull"});
    }
}
