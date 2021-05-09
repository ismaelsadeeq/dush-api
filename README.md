# dush-api
Dush api integrated to CELO


### API LINK
* (The Hosted api link)

### Built with
* Node
* Express
* Mysql (Sequelize ORM)
* Celo Blockchain ( Contract Kit)

### Reference
* (https://sequelize.org/master/manual/assocs.html)
* (npm package manager)
* (celo.org)

#### Abubakar Sadiq Ismail
* Github:https://github.com/ismaelsadeeq

#### End points
* Create Account
* Login to your account
* Logout 
* Verify your email
* forget password
* reset Password
* get Profile 
* get Account balance
* send Celo
* send Celo USD

## Create Account
* METHOD : POST,
* url: api/v1/signup,
* Request parameters
    {
      email:string
      password:string,
      confirmPassword:string
    }
  
* Response 
    {
      status:true,
      message: Account created succesfully,
      user:{
        email:abc@domain.com,
        address:765e7e8344r3ee......,
      }
    }


## Verify Email
* METHOD : POST,
* url: api/v1/verify-email,
* Authorization: Bearer token(login token generated),
* Request parameters
    {
      code:string
    }

* Response 
    {
      status:true,
      message:Account Verified
    }


## Login
* METHOD : POST,
* url: api/v1/login,
* Request parameters
    {
      email:string,
      password:string
    }

* Response 
    {
      token:876retghjddhe6e7.....,
      data:user:{
        email:abc@domain.com,
        address:765e7e8344r3ee......,
      } ,
      statusCode:200,
      status:success
    }
## Logout
* METHOD : GET,
* url: api/v1/login,
* Authorization: Bearer token(login token generated),
* Request parameters
    {
      email:string,
      password:string
    }

* Response 
    {
      status:true,
      message:logged out
    }

## Forget Password
* METHOD : POST
* url: api/v1/send-code
* Request parameters
    {
      email:string
    }

* Response 
    {
      status:true
      message:code Sent
    }

## Change Password After Sending Code
* METHOD : POST
* url: api/v1/send-code
* Request parameters
    {
      code:string,
      password:string,
      confirmPassword:string
    }

* Response 
    {
      status:true
      message:Password Changed 
    }


## Get User Profile
* METHOD : GET
* url: api/v1/user
* Authorization: Bearer token(login token generated)
* Request parameters
  none
* Response 
    {
      status:true,
      user:{
        id:5657wesdwd....,
        email:abc@domain.com,
        address:5678902ddu...,
        celoBalance:x.xx,
        cusdBalance:x.xx
      }
    }


## Send Celo
* METHOD : POST,
* url: api/v1/send-celo,
* Authorization: Bearer token(login token generated),
* Request parameters
    {
      address:string //recievers address
      amount:string //amount to be sent
    }

* Response 
    {
      status:true,
      message:Celo sent successfully
    }

## Send Celo USD
* METHOD : POST,
* url: api/v1/send-cusd,
* Authorization: Bearer token(login token generated),
* Request parameters
    {
      address:string //recievers address
      amount:string //amount to be sent
    }

* Response 
    {
      status:true,
      message:Cusd sent successfully
    }
## Send Celo USD
* METHOD : GET,
* url: api/v1/balance,
* Authorization: Bearer token(login token generated),
* Request parameters
    {
      address:string //recievers address
      amount:string //amount to be sent
    }

* Response 
    {
      status:true,
      message:Cusd sent successfully
    }
