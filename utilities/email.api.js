
require('dotenv').config();
const mailjet = require ('node-mailjet').connect(process.env.MAILJET_PUBLIC,process.env.MAILJET_PRIVATE);

async function sendMail(to,variables,subject="Notification from Dush Support"){
  let message = variables.body;
  let names = variables.names
  let code = variables.code
  const request = mailjet
    .post("send", {'version': 'v3.1'})
    .request({
        "Messages":[{
            "From": {
                "Email":process.env.MAIL_SENDER,
                "Name":process.env.MAIL_SENDER_NAME
            },
            "To": [{
                "Email": to,
                "Name": names
            }],
            "Subject": subject,
            "TextPart": code,
            "HTMLPart": message
        }]
    })
request
    .then((result) => {
        console.log(result.body,"variables:",variables)
    })
    .catch((err) => {
        console.log(err)
    })
  
}
module.exports ={
  sendMail
}