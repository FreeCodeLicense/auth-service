const { User } = require("../../models/index")

const isEmailConfirmed=async (req,res,next)=>{

    try{

        let { user } = req.body
        let userRecord=await User.findById(user.data._id)
        if(!userRecord.emailConfirmedAt){
            res.redirect("/api/verifyemail")
        } else {
            next()
        }
    } catch(err){
        console.log(err)
    }

}

module.exports=isEmailConfirmed