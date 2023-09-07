const mongoose = require('mongoose');
const database = require('../config/db');
const bcrypt = require('bcrypt');

const authSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});


authSchema.pre('save',async function(){
    try {
      var user = this;
      const salt = await(bcrypt.genSalt(10));
      const hashpass = await bcrypt.hash(user.password , salt);
      user.password = hashpass;
    } catch (error) {
      throw error;
    }
  
  });

const authModel = database.model('authdata',authSchema);
module.exports = authModel;