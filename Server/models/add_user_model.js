const mongoose = require("mongoose");
const database = require("../config/db");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  rfid: {
    type: String,
    required: true,
  },
  rollnumber: {
    type: String,
    required: true,
  },
  balance: {
    type: String,
    required: true,
    default: 0,
  },
  rechargeHistory: {
    type: Array,
    default: [],
  },
  expenseHistory: {
    type: Array,
    default: [],
  },
});

const userModel = database.model("userdatas", userSchema);
module.exports = userModel;
