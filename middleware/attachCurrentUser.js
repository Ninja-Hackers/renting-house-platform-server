const User = require("../models/User.model");

const attachCurrentUser = (req, res, next) => {
  const loggedInUser = req.payload;

  User.findOne({ _id: loggedInUser._id })
    .then((response) => {
      req.currentUser = response;
      return next();
    })
    .catch((err) => {
      res.status(500).json({
        message: "error getting user data",
        error: err,
      });
    });
};

module.exports = attachCurrentUser;
