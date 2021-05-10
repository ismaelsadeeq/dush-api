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
const register = async (req,res) =>{
  const data = req.body;
  if(data.password === data.confirmPassword){
      const saltRounds = 10;
      const salt = bcrypt.genSaltSync(saltRounds);
      const hash = bcrypt.hashSync(data.password,salt)

      data.password = hash;
      let msg;
      const checkUser = await models.user.findOne({where:{email:data.email}});
      var user = undefined;

      if (checkUser){
        responseData.message = "you have an account sign in";
        responseData.status=false
        return res.json(responseData);
      } 
      else
      {
        const address = await  celo.createAccount();
         user = await models.user.create(
          {
           id:uuid.v4(),
           email:data.email,
           address:address,
           password:data.password
          }
        );
        //generate otp and send email
        let val = helpers.generateOTP();
        let names = data.firstname +' '+ data.lastname
        const msg = "Welcome "+user.firstName+", use the code "+ val+" to verify your email and activate your NobaAfrica Account";
        data.variables = {
          "names":names,
          "code": val,
          "summary": msg,
          "body":msg
        }
        data.val = val
        await models.otpCode.create({id:uuid.v4(),code:val,userId:user.id});
        sendEmail(data)
      }
      if(!user){
        responseData.status = false;
        responseData.message = "Could not create account";
        responseData.data=user;
        return res.json(responseData);
      }
      responseData.status = true
      responseData.message = "Account created succesfully";
      return res.json(responseData);

  } else {
    responseData.status = false
    responseData.message = "password didnt match";
      return res.json(responseData)
  }
}

const login = async (req,res)=>{
  const data = req.body;
    const email = data.email;

    const password = data.password;
    const user = await models.user.findOne(
      {
        where:{email:email}
    }
    );
    if (user){
      const checkPassword = bcrypt.compareSync(password,user.password);
      if (!checkPassword) {
        responseData.message = "Incorrect passsword";
        responseData.status = false;
        return res.json(responseData)
      } else {
        const jwt_payload ={
          id:user.id,
        }
        await models.isLoggedout.destroy({where:{userId:user.id}}) 
        const token = jwt.sign(jwt_payload,process.env.SECRET);
        user.password = undefined;
        return res.json(
          { "token":token,
            "data":user,
            "statusCode":200,
            "status": "success"
          }
          )
      }
  } else {
    responseData.status = false;
    responseData.message = "No account found"
    return res.json(responseData)
  }
}
const sendCode = async (req,res)=>{
  const data = req.body;
  const email = data.email;
  const user = await models.user.findOne(
    {
      where:{email:email}
    }
  )
  if (user){
    let val = helpers.generateOTP();
    const summary = "Hello "+user.firstname+", use the code "+ val+" to reset your password to NobaAfrica Account";
    const msg = "Hello "+user.firstname+", we heard you could not login to your  Account. This things happen to even the most careful of us, you should not feel so bad.  In the meantime, use the code "+ val+" to reset your password for your NobaAfrica Account. You should be back into your account in no time. <br/> <br /> <br /> <br /> <small>If you did not request this, you do not have to do anything  </small>";
    let names = user.firstname +" "+ user.lastname
    data.variables = {
       "code": val,
       "summary": summary,
       "names": names,
       "body":msg
    }

    data.val = val
    const sendMail =  sendEmail(data)
    if(sendMail){
    await models.otpCode.create(
      {
        id:uuid.v4(), 
        code:val,
        userId:user.id
      }
    );
    responseData.message = "code Sent"
    return res.json(responseData);
    } else{
      responseData.message = "An error occurred";
      responseData.status = false
      return res.json(responseData)
    }
    
  }else{
    res.json({
      "status":false,
      "message":"No account with this email"
    })
  }

}
const verifyEmail = async (req,res)=>{
  data = req.body;
  const code = await models.otpCode.findOne({where:{code:data.code}});
  if(code){
    const user = await models.user.findByPk(code.id);
    if(user){
      responseData.message = 'Account is already verified';
      return res.json(responseData);
    } 
      await models.user.update({isVerified:true},{where:{id:code.userId}});
      await models.otpCode.destroy({where:{code:data.code}})
      responseData.message = 'Account Verified';
      responseData.status = true;
      return res.json(responseData);
  }else{
    responseData.status = false,
    responseData.message = 'Invalid Code entered';
    return res.json(responseData)
  }
}
const resetPassword = async  (req,res)=>{
  data = req.body;
  const code = await models.otpCode.findOne(
    {
      where:{code:data.code}
    }
  );
  if(code){
      if(data.password === data.confirmPassword){
        const saltRounds = 10 
        const salt = bcrypt.genSaltSync(saltRounds);

        const hash = bcrypt.hashSync(data.password, salt);
      
        data.password = hash
        await models.user.update(
          {
            password:data.password
          },
          {
            where:{id:code.userId}
          }
        );
        await models.otpCode.destroy(
          {
            where:{code:data.code}
          }
        )
        responseData.status = true;
        responseData.message = 'password changed'
        return res.json(responseData)
      }
      else{
        responseData.status = false;
        responseData.message = 'password do not match'
        return res.json(responseData)
      }
  }else{
    responseData.status = true;
    responseData.message = 'Code is Incorrect'
    return res.json(responseData)
  }
}
const logout = async (req,res)=>{
  await models.isLoggedout.create({id:uuid.v4(),userId:req.user.id,status:true});
  responseData.status = true;
  responseData.message = "logged out"
  return res.json(responseData);
}

const sendEmail= (data)=>{
  const sendMail = mailer.sendMail(data.email, data.variables,data.msg)
 if(sendMail){
 return true
 } else{
   return false
 }
}
const sendCelo = async (req,res)=>{
  let data = req.body;
  const user = req.user
  const send = await celo.sendCelo(user.address,data.address,data.amount)
  if(send){
    responseData.status = true
    responseData.message = "Celo sent successfully"
    responseData.data = send;
    return res.json(responseData)
  }
  responseData.status = false
  responseData.message = "Something went wrong"
  return res.json(responseData)

}
const sendCusd = async (req,res)=>{
  let data = req.body;
  const user = req.user
  const send = await celo.sendCusd(user.address,data.address,data.amount)
  if(send){
    responseData.status = true
    responseData.message = "Cusd sent successfully"
    responseData.data = send;
    return res.json(responseData)
  }
  responseData.status = false
  responseData.message = "Something went wrong"
  return res.json(responseData)
}
const accountBalance = async (req,res)=>{
  const user = req.user
  const balance = await celo.getBalance(user.address)
  if(balance){
    await models.user.update(
      {
        celobBalance:balance.celoBalance,
        cusdBalance:balance.cUSDBalance
      },
      {
        where:{id:user.id}
      }
    )
    responseData.status = true
    responseData.message = "Balance updated"
    responseData.data = balance;
    return res.json(responseData)
  }
  responseData.status = false
  responseData.message = "Something went wrong"
  return res.json(responseData)
}

module.exports = {
  register,
  login,
  sendCode,
  verifyEmail,
  resetPassword,
  logout,
  sendCelo,
  sendCusd,
  accountBalance
}