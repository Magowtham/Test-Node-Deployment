const addUserModel = require('../models/add_user_model');


class UserService{
    static async newUser(name , rfid , rollnumber){
        try {
            const data=await addUserModel.findOne({rfid})
            if(data == null){
                const createUser = new addUserModel({name , rfid , rollnumber});
                await createUser.save();
                return true;
            }else{
                return false;
            }
            

        } catch (error) {
            throw error;
        }
    }
}

module.exports = UserService;