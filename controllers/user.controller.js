const uuid = require("uuid");
const models = require("../models/index"); 
const bcrypt = require("bcrypt");
const JwtStartegy = require("passport-jwt").Strategy;
const jwt = require("jsonwebtoken");
const mailer = require("../utilities/email.api");
const helpers = require("../utilities/helpers");
const celo = require('../celo/helloCelo')
require("dotenv").config();
const mailjet = require ("node-mailjet").connect(process.env.MAILJET_PUBLIC,process.env.MAILJET_PRIVATE);

const responseData = {
	status: true,
	message: "Completed",
	data: null
}
const getUser =async (req,res) =>{
  const data = req.user;
  const user = await models.user.findOne(
          {
            where:{id:data.id}
          })
  if(user){
    responseData.data = user
    return re.json(responseData)
  }
  responseData.status = false
  responseData.message = "Something went wrong"
  return res.json(responseData);
}

module.exports = {
  getUser
}