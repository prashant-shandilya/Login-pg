const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require('bcrypt')
const nodemailer = require("nodemailer");
const EmployeeModel = require('./models/employee')
const AddressModel = require('./models/Address')
var random = require('random-string-generator');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const JWT_SECRET = "22kh4i3kj"

const app = express()
app.use(express.json())
app.use(cors())

mongoose.connect("mongodb://127.0.0.1:27017/hello")

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer <token>

  if (!token) return res.status(401).json({ msg: 'Token not found' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ msg: 'Token invalid' });

    req.user = decoded; // Store user info
    next();
  });
}

app.get('/outh_page', (req, res) => {
  const link = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=468979056259-r25p6vqnqvkgd2hlkgl2j7t3nm34uffc.apps.googleusercontent.com` +
    `&redirect_uri=http://localhost:5173/outhcallback` +
    `&response_type=code` +
    `&scope=openid%20email%20profile`;

   return res.send(link);
  // res.send("hello world");

})

app.post('/outhcallback', async (req, res) => {
  const code = req.body.code;

   const tokenResponse = await axios.post(
      'https://oauth2.googleapis.com/token',
      {
        code,
        client_id:"xyz",
        client_secret:"xyz",
        redirect_uri:"http://localhost:5173/outhcallback",
        grant_type: 'authorization_code'
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

     const { access_token, id_token } = tokenResponse.data;



    const userInfo = await axios.get(
      `https://www.googleapis.com/oauth2/v2/userinfo`,
      { headers: { Authorization: `Bearer ${access_token}` } }
    );


    res.send(`
      <h2>Welcome ${userInfo.data.name}</h2>
      <p>Email: ${userInfo.data.email}</p>
      <img src="${userInfo.data.picture}" />
    `);
  



});

app.post('/getInfo', verifyToken, async (req, res) => {
    const user = await EmployeeModel.findOne({ email: req.body.email }).populate('addresses');
    if (!user) return res.json("No user found !");
    const obj = {
        name: user.name,
        email: user.email,
        pass: user.password,
        address: user.addresses, // now an array of Address objects
    };
    return res.json(obj);
});

app.post('/addAddress', verifyToken, async (req, res) => {
    const { email, address } = req.body;
    // address should be an object: { name, addressline1, addressline2, postCode, city, country }
    try {
        const user = await EmployeeModel.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ msg: "No user found!" });
        }
        const newAddress = await AddressModel.create(address);
        user.addresses.push(newAddress._id);
        await user.save();
        await user.populate('addresses');
        return res.json({
            msg: "Address added successfully!",
            addresses: user.addresses
        });
    } catch (error) {
        console.error("Error adding address:", error);
        return res.status(500).json({ msg: "Error adding address" });
    }
});

app.put('/updateAddress', verifyToken, async (req, res) => {
    const { email, addressId, updatedAddress } = req.body;
    // updatedAddress: { name, addressline1, addressline2, postCode, city, country }
    try {
        const user = await EmployeeModel.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ msg: "No user found!" });
        }
        const address = await AddressModel.findById(addressId);
        if (!address) {
            return res.status(404).json({ msg: "Address not found!" });
        }
        Object.assign(address, updatedAddress);
        await address.save();
        await user.populate('addresses');
        return res.json({
            msg: "Address updated successfully!",
            addresses: user.addresses
        });
    } catch (error) {
        console.error("Error updating address:", error);
        return res.status(500).json({ msg: "Error updating address" });
    }
});

app.post('/setPassword', async (req,res) =>{
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
    let myUser;
    EmployeeModel.findOne({email:email})
    .then(async (user)=> {
        if(user){
                const hash = user.password
                const isMatch = await bcrypt.compare(password,hash);

                if(isMatch){
                      if(user.isTempPasswordUsed){
                            return res.json("navigate to setPswrd");
                        }
                     const token = jwt.sign(
    {email: user.email },
    JWT_SECRET,
    { expiresIn: '1h' } // Token valid for 1 hour
  );

    return res.json({msg:"Success",token})
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



app.post('/register', async (req, res) => {
    const pass = req.body.password;
    const hash = await bcrypt.hash(pass, 10);
    req.body.password = hash;
    if (!req.body.addresses) req.body.addresses = [];
    EmployeeModel.create(req.body)
        .then(employees => res.json(employees))
        .catch(err => res.json(err))
});


app.listen(3001, () => {
    console.log("the server is running");
})
