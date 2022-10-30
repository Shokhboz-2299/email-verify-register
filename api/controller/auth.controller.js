const { Users } = require('../../models/models');
const { UserVerification } = require('../../models/userVerification');
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const { v4: uuidv4 } = require('uuid');
require('dotenv').config()
const path = require('path');

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  }
})

// testing 
transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  }
  else {
    console.log("Ready for messages");
    console.log(success);
  }
})


// Signup
const REGISTER = async (req, res) => {
  try {
    let { name, email, password } = req.body;
    console.log(req.body);
    name = name?.trim();
    email = email?.trim();
    password = password?.trim();
    if (!name || !email || !password) {
      return res.json({
        status: 'Failed',
        message: 'Empty input fields!'
      })
    }

    const candidate = await Users?.findOne({ where: { email } })
    if (candidate) {
      return next(ApiError.badRequest('user is already exist'))
    }
    const hashPassword = await bcrypt.hash(password, 5)
    const user = await Users.create({
      name,
      email,
      verified: false,
      password: hashPassword
    })
    sendVerificationEmail(result, res);

  } catch (error) {
    throw error
  }
}

// send verification email 
const sendVerificationEmail = async ({ id, email }, res) => {
  const currentUrl = "http://localhost:3000"
  const uniqueString = uuidv4() + id;
  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: "Verify Your Email",
    html: `<p>Verify your email and Press <a href=${currentUrl + 'user/verify/' + id + '/' + uniqueString}> here</a> to proceed.</p>`,
  };

  const hashUniqueString = await bcrypt.hash(uniqueString, 5)
  await UserVerification.create({
    userId: id,
    uniqueString: hashUniqueString,
    createdAt: Date.now(),
    expiresAt: Date.now() + 21600000,
  })
  await transporter.sendMail(mailOptions)
  res.json({
    status: 'PENDING',
    message: "verification email sent"
  })
}

// verify 
const VERIFY = async (req, res) => {
  const { userId, uniqueString } = req.params;
  const userverify = await UserVerification?.findOne({ where: { userId } })
  if (userverify.length > 0) {
    const { expiresAt } = userverify
    const hashedUniqueString = expiresAt.uniqueString
    if (expiresAt < Date.now()) {
      await UserVerification.destroy({
        where: { userId }
      })
      await Users.destroy({
        where: { id: userId }
      })
      let message = 'expired user. Please sign in or sign up'
      res.redirect(`/verified/error=true&message=${message}`)
    }
    else {
      const compared = await bcrypt.compare(uniqueString, hashedUniqueString)
      if(compared){
        
      }
    }

  }
  else {
    let message = 'user not authorized'
    res.redirect(`/verified/error=true&message=${message}`)
  }
}

// Signin
const LOGIN = async (req, res) => {
  const { email, password } = req.body
  const user = await Users.findOne({ where: { email } })
  if (!user) {
    return next(ApiError.internal('user not exist'))
  }
  let comparePassword = bcrypt.compareSync(password, user.password)
  if (!comparePassword) {
    return next(ApiError.internal('wrong password'))
  }
  return res.json('successfully logged in')
}

module.exports = {
  REGISTER,
  LOGIN,
  VERIFY
}