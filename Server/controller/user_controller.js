const { query } = require("express");
const UserService = require("../services/user_service");

exports.addUser = async (req, res) => {
  try {
    const { name, rfid, rollnumber } = req.body;
    const successUser = await UserService.newUser(name, rfid, rollnumber);
    if (successUser?.status) {
      res.status(200).json(successUser);
    } else {
      res.json(successUser);
    }
  } catch (error) {
    res
      .status(500)
      .json({ status: false, exisist: true, message: "Unsuccessfull" });
  }
};

exports.getUser = async (req, res) => {
  try {
    const pageNumber = parseInt(req.query.pageNumber) || 0;
    const pageLimit = parseInt(req.query.pageLimit) || 5;
    const result = await UserService.userPagination(pageNumber, pageLimit);
    if (result.status) {
      res.json(result);
    }
  } catch (error) {
    res.status(500).json({ status: false, message: "Unable To Find Users" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { name, rfid, password } = req.body;
    const isDelete = await UserService.deleteUserData(name, rfid, password);
    if (!isDelete.status) {
      res.json(isDelete);
    } else {
      res.status(200).json(isDelete);
    }
  } catch (error) {
    res.status(500).json({ status: false, message: "Server Error" });
  }
};

exports.editDetails = async (req, res) => {
  try {
    const id = req.params.id;
    const { admin, name, rfid, rollnumber, password } = req.body;
    const isEdited = await UserService.editUserDetails(
      admin,
      id,
      name,
      rfid,
      rollnumber,
      password
    );
    if (!isEdited.status) {
      res.json(isEdited);
    } else {
      res.status(200).json(isEdited);
    }
  } catch (error) {
    res.status(500).json({ status: false, message: "Server Error" });
  }
};

exports.rechargeUser = async (req, res) => {
  try {
    const { rfid, amount } = req.body;
    const isRecharged = await UserService.Recharge(rfid, amount);
    if (!isRecharged) {
      res.json(isRecharged);
    } else {
      res.status(200).json(isRecharged);
    }
  } catch (error) {
    res.status(500).json({ status: false, message: "Server Error" });
  }
};

exports.getRechargeHistory = async (req, res) => {
  try {
    const rfid = req.query?.rfid;
    const pageStart = req.query?.pageStart;
    const pageSize = req.query?.pageSize;
    const reductionStatus = req.query?.reductionStatus;
    const isRechargeHistory = await UserService.rechargePagination(
      rfid,
      pageStart,
      pageSize,
      reductionStatus
    );
    if (!isRechargeHistory?.status) {
      res.json(isRechargeHistory);
    } else {
      res.status(200).json(isRechargeHistory);
    }
  } catch (error) {
    res.status(500).json({ status: false, message: "Server Error" });
  }
};

exports.searchUser = async (req, res) => {
  try {
    const { query } = req.query;
    const searchResult = await UserService.search(query);
    if (!searchResult.status) {
      res.status(200).json(searchResult);
    } else {
      res.status(200).json(searchResult);
    }
  } catch (error) {
    res.status(500).json({ status: false, message: "Server Error" });
  }
};

exports.startCall = async (req, res) => {
  try {
    const { rfid } = req.body;
    const startCallResult = await UserService.getBalance(rfid);
    if (!startCallResult?.status) {
      res.json(startCallResult);
    } else {
      res.status(200).json(startCallResult);
    }
  } catch (error) {
    res.status(500).json({ status: false, message: "Server Erorr" });
  }
};
exports.endCall = async (req, res) => {
  try {
    const { rfid, balance } = req.body;
    const endCallResult = await UserService.setBalance(rfid, balance);
    if (!endCallResult?.status) {
      res.json(endCallResult);
    } else {
      res.status(200).json(endCallResult);
    }
  } catch (error) {
    res.status(500).json({ status: false, message: "Server Erorr" });
  }
};

exports.expenseHistory = async (req, res) => {
  try {
    const rfid = req.query?.rfid;
    const pageStart = req.query?.pageStart;
    const pageSize = req.query?.pageSize;
    expenseHistoryResult = await UserService.expenseHistoryPagination(
      rfid,
      pageStart,
      pageSize
    );
    if (!expenseHistoryResult?.status) {
      res.json(expenseHistoryResult);
    } else {
      res.status(200).json(expenseHistoryResult);
    }
  } catch (error) {
    res.status(500).json({ status: false, message: "Server Error" });
  }
};
exports.dailyHistoryDownloader = async (req, res) => {
  const arr = [{ name: "gowtham", hobby: "birding", branch: "ECE" }];
};
