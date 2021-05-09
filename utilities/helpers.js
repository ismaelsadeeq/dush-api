const models = require('../api/auth/models');

const generateOTP =()=>{
    let value,val;
    value = Math.floor(100000 + Math.random() * 9000000);
    val = value.toString().substring(0, 6);
    return val
}
module.exports ={
    generateOTP
}