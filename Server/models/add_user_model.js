const mongoose = require('mongoose');
const database = require('../config/db');


const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    rfid:{
        type:String,
        required:true
    },
    rollnumber:{
        type:String,
        required: true
    },
    balance:{
        type:String,
        required:true,
        default:0
    }
});

const userModel = database.model('userdata',userSchema);
module.exports = userModel;

