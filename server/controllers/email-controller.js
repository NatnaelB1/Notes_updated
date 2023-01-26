const postmark = require("postmark");
const Email = require('../model/email-model')
const User = require('../model/user-model')


sendEmail = async (req, res) => {
    const {email} = req.body;
    try{
    const possibleUser = await User.findOne({ email: email });                  // find email in User
    if(!possibleUser) {
        return res.status(400).json({errorMessage:"Email not found"});
    }

    let code = Math.floor(1000000 + Math.random() * 9000000);                   // generate code and send email
    const client = new postmark.ServerClient("e6e0a7f9-eaed-43f2-986c-a4a8267fef50");
    client.sendEmail({
        "From": "sean.yang@stonybrook.edu",
        "To": email,
        "Subject": "Tileslate Email Verification",
        "HtmlBody": "Your Tileslate passcode is (will expire after 10 minutes): " + code,
        "MessageStream": "outbound"
      });

      const newEmail = new Email({email: email, passcode: code})            // add email-code pair to Email
      Email.create(newEmail)
      return res.status(200).json({
        success:true
    })
    }catch(error){
        return res.status(404).json({errorMessage:"Email error"});
    }
}

passcodeVerify = async (req, res) => {
    const {email, attempt} = req.body;
    try{
        const requestedEmail = await Email.findOne({ email: email });       // find email
        let check = attempt === requestedEmail.passcode                  // check passcode
        if(check === true){                                                      // if true, delete
            await Email.findOneAndDelete({email: email}); 
            return res.status(200).json({
                success: true
            })
        }
        else{
            return res.status(400).json({
                success: false
            })
        }
        
    
    }catch(error){
        return res.status(404).json({errorMessage:"Email error"});
    }
}


module.exports = {
    sendEmail,
    passcodeVerify
}