const authModel = require('../models/auth_model');
const Authentication = require('../services/auth_service');


exports.AdminAuth = async (req , res) =>{
    try {
        const {name , password} = req.body;
        const isCorrect = await Authentication.autheinticateUser(name , password);
        if(isCorrect.status){
            res.status(200).json(isCorrect);
        }else{
            res.status(400).json(isCorrect);
        }
        
    } catch (error) {
        res.status(500).json({status:false , message:'Server Error'})
    }
}



exports.Register = async (req , res) =>{
    const {name , password} = req.body;
    const isValid = await Authentication.registerUser(name , password);
    if(!isValid.status){
        res.status(400).json(isValid);
    }else{
        res.status(200).json(isValid);
    }
}


