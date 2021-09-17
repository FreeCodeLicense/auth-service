require("dotenv").config()
const mongoose=require("mongoose")

mongoose.connect(process.env.MONGO_URL,()=>{
    console.log("Database connected")
}).catch(err=>{
    console.log(err)
})


const UserSchema=new mongoose.Schema({
    name:String,
    surname:String,
    salt:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    role:{
        type:String,
        default:"user"
    },
    emailConfirmedAt:{
        type:String,
        default:null
    },
    password: String,

})


const User=mongoose.model("User",UserSchema)


module.exports={
    User
}
