// generate token using secret from process.env.JWT_SECRET
var jwt = require('jsonwebtoken');

// generate token and return it
function generateToken(context) {
  //1. Don't use password and other sensitive fields
  //2. Use the information that are useful in other parts
  if (!context) return null;

  const {
    User
  } = context;

  var context = {
    User: {
      RefID: User.RefID,
      FirstName: User.FirstName,
      SecondName: User.SecondName,
      LastName: User.LastName,
      RoleName: User.RoleName,
      Email: User.Email,
      Phone: User.Phone,
    },
  };

  return token = jwt.sign(context, process.env.JWT_SECRET, {
    expiresIn: 60 * 60 * 24 // expires in 24 hours
  });
}

// return basic user details
function getCleanContext(context) {
  if (!context) return null;

  const {
    User
  } = context;

  return {
    User: {
      RefID: User.RefID,
      FirstName: User.FirstName,
      SecondName: User.SecondName,
      LastName: User.LastName,
      RoleName: User.RoleName,
      Email: User.Email,
      Phone: User.Phone,
    },
  };
}

module.exports = {
  generateToken,
  getCleanContext
}