const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require('bcrypt')
const nodemailer = require("nodemailer");
const EmployeeModel = require('./models/employee')
var random = require('random-string-generator');

const app = express()
app.use(express.json())
app.use(cors())

mongoose.connect("mongodb://127.0.0.1:27017/hello")

app.post('/getInfo', async (req,res) =>{

    // console.log(req.body.email)

    const user = await EmployeeModel.findOne({ email: req.body.email });

    if(!user)return res.json("No user found !")

    // console.log(user)

    const obj = {
        name:user.name,
        email:user.email,
        pass:user.password
    }
    return res.json(obj);

})

app.post('/setPassword',async (req,res) =>{
    const pass1 = req.body.pass;
    const mail = req.body.email;

    console.log(mail)

    const user = await EmployeeModel.findOne({ email: req.body.email });

    

    user.password = await bcrypt.hash(pass1, 10)
    user.isTempPasswordUsed = false;
    await user.save(); 

    return res.json("Password is changed !")
    
})

app.post('/login',(req,res)=>{
    const {email,password} = req.body;
    EmployeeModel.findOne({email:email})
    .then(async (user)=> {
        if(user){
                const hash = user.password
                const isMatch = await bcrypt.compare(password,hash);

                if(isMatch){
                      if(user.isTempPasswordUsed){
                            return res.json("navigate to setPswrd");
                        }
                   return res.json("Success")
                }
                    else
                       return  res.json("the password is incorrect")
}   
        else{
            res.json("no record existed");
        }
    })
    
})

app.post('/forgot',async (req,res)=>{

            const user = await EmployeeModel.findOne({ email: req.body.email });

    if (!user) {
        return res.json("Wrong Email typed");
    }

    const newPassword = random('alphanumeric'); 
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword; 
    user.isTempPasswordUsed = true;
    await user.save(); 
    //Use nodemailer here to send the newPassword to the email.

    const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "greatpk2012@gmail.com",
    pass: "bxfgfyldqvsbfqid",
  },
});

const mailOptions = {
  from: "greatpk2012@gmail.com",
  to: `${req.body.email}`,
  subject: "Change password from authentication page.",
  text: `${newPassword} is your new password. Please use it to login into the app and then proceed ahead to change password`,
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error("Error sending email: ", error);
  } else {
    console.log("Email sent: ", info.response);
  }
});

    res.json({ msg: "Password changed! check your email" });
})

app.post('/register', async (req,res)=>{

    // EmployeeModel.findOne({email:req.body.email}).then(user=>{
    //     res.json("The email is already taken.")
    // })
    const pass = req.body.password;

    const hash = await bcrypt.hash(pass,10);

    req.body.password = hash;

    EmployeeModel.create(req.body).then(employees => res.json(employees)).catch(err => res.json(err))
})


app.listen(3001, () => {
    console.log("the server is running");
})