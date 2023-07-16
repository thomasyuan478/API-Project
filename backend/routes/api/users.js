const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// const validateSignup = [
//   check('email')
//     .exists({ checkFalsy: true })
//     .isEmail()
//     .withMessage('Please provide a valid email.'),
//   check('username')
//     .exists({ checkFalsy: true })
//     .isLength({ min: 4 })
//     .withMessage('Please provide a username with at least 4 characters.'),
//   check('username')
//     .not()
//     .isEmail()
//     .withMessage('Username cannot be an email.'),
//   check('password')
//     .exists({ checkFalsy: true })
//     .isLength({ min: 6 })
//     .withMessage('Password must be 6 characters or more.'),
//   check('firstName')
//     .exists({ checkFalsy: true})
//     .withMessage('Please provide a first name'),
//   check('lastName')
//     .exists({ checkFalsy: true})
//     .withMessage('Please provide a last name'),
//   handleValidationErrors
// ];

// router.post(
//   '/',
//   validateSignup,
//   async (req, res) => {
//     const { email, password, username, firstName, lastName } = req.body;
//     const hashedPassword = bcrypt.hashSync(password);
//     const user = await User.create({ email, username, hashedPassword, firstName, lastName });

//     const safeUser = {
//       id: user.id,
//       email: user.email,
//       username: user.username,
//       firstName: user.firstName,
//       lastName: user.lastName
//     };

//     await setTokenCookie(res, safeUser);

//     return res.json({
//       user: safeUser
//     });
//   }
// );

const validateSignup = [
  async(req,res,next) => {
    const { email, firstName, lastName, username, password } = req.body;

    if(!email || !firstName || !lastName || !email.includes('@') || !username || !password){
      const err = new Error('Bad Request');
      err.status = 400;
      err.errors = {};
      if(!email) err.errors.email = "Email is required"
      if(!email.includes('@')) err.errors.email = "Invalid email"
      if(!firstName) err.errors.firstName = "First Name is required";
      if(!lastName) err.errors.lastName = "Last Name is required";
      if(!username) err.errors.username = "Username is required";
      if(!password) err.errors.password = "password is required";
      return next(err);
    }
    return next();
  },
  async(req,res,next) => {
    const { email, username } = req.body;

    const takenEmail = await User.findOne({where: {email: email}});
    const takenUsername = await User.findOne({where: {username: username}});

    if(takenEmail || takenUsername){
      const err = new Error('User already exists');
      err.status = 500;
      err.errors = {};
      if(takenEmail) err.errors.email = "User with that email already exists";
      if(takenUsername) err.errors.username = "User with that username already exists";
      return next(err);
  }
  return next();
}
]

router.post(
  '/',
  validateSignup,
  async (req, res) => {
    const { email, password, username, firstName, lastName } = req.body;

    if(!email || !firstName || !lastName){
      const err = new Error('Login failed');
      err.status = 400;
      err.title = 'Login failed';
      err.errors = {};
      if(!email) err.errors.email = "Email is required";
      if(!password) err.errors.password = "Password is required";
      return next(err);
    }

    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create({ email, username, hashedPassword, firstName, lastName });

    const safeUser = {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName
    };

    await setTokenCookie(res, safeUser);

    return res.json({
      user: safeUser
    });
  }
);


module.exports = router;
