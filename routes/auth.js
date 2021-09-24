const argon2=require("argon2")
const express=require("express")
const router=express.Router()
const { User } =require("../models")
const jwt=require("jsonwebtoken")
const { randomBytes } = require("crypto")
const nodemailer=require("nodemailer")
const auth=require("./middlewares/isAuth")

router.post("/register",async (req,res)=>{
    try{
        let { name, surname, email, password} = req.body
        if(!(name && surname && email && password)){
            res.json({ status:"error", message:"Input fields is required" })
        }

        let user=await User.findOne({ "email":email })
        if(user){
            res.json({ status:"error", message:"Email already exists" })
        }

        let hashedPassword=await argon2.hash(password)
        let salt=randomBytes(32)

        let userRecord=await User.create({
            "name":name,
            "surname": surname,
            "email": email,
            "password": hashedPassword,
            "salt": salt.toString("hex")
        })

        res.status(200).json({
            status:"ok",
            user:{
                email:userRecord.email,
                name:userRecord.name
            },
            token:generateToken(userRecord)
        
        })

    } catch (err){
        console.log(err)
    }

})



router.post("/login",async (req,res)=>{
    try{
        let { email, password } = req.body
        
        if(!(email && password)){
            res.json({ status:"error", message:"Input fields is required" })
            return
        }
        let userRecord=await User.findOne({ "email": email })
        
        if(!userRecord){
            res.json({ status:"error", message:"User not found!" })
            return
        }

        let correctPassword=await argon2.verify(userRecord.password,password)
        
        if(!correctPassword){
            res.json({ status:"error", message:"Password is incorrect" })
            return
        }

        res.json({
            status:"ok",
            user:{
                email:userRecord.email,
                name:userRecord.name
            },
            token: generateToken(userRecord)
        })

    } catch(err){
        console.log(err)
    }
   
})

router.get("/restore",auth, (req,res)=>{
    res.json({ status: "ok", user: req.user })
})

router.post("/verifyemail",auth,async (req,res)=>{
    try{
        let user=await User.findById(req.user.data._id)

        let transport=nodemailer.createTransport({
            service:"Gmail",
            port: 587,
            secure: false, // true for 465, false for other ports
            requireTLS: true,
            auth:{
                user: "abrorbek.ubaydullayev98@gmail.com",
                pass: "Abrorbek123!"
            }
        })

        let sender="Abrorbek"
        let mailOptions={
            from: sender,
            to: user.email,
            subject: "Email confirmation",
            html: `Press <a href='${process.env.APP_URL}/verify/${user.salt}'>here</a> to verify your email. Thanks`
        }

        transport.sendMail(mailOptions,(err,res)=>{
            if(err){
                console.log(err)
            } 

            console.log("Message sent")
        })

        res.json({ status: "ok", message:"Email sent" })

    } catch(err){
        console.log(err)
    }
})


const generateToken=(user)=>{
    let data={
        _id:user._id,
        name:user.name,
        surname:user.surname,
        role: user.role
    }

    const signature=process.env.ENCRYPT_KEY
    const expiration="6h"

    return jwt.sign(data,signature,{ expiresIn:expiration })

}

module.exports=router