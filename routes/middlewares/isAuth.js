const jwt=require("jsonwebtoken")

const verifyToken=(req, res, next)=>{
    let token=req.body.token || req.query.token || req.headers['x-access-token']
    if(!token){
        return res.json({
            status: "error",
            message: "Token not found"
        })
    }

    try {
        let decoded=jwt.verify(token, process.env.ENCRYPT_KEY)
        req.user=decoded
    } catch (err){
        return res.json({
            status:"error",
            message: "You have no access!"
        })
    }

    return next()
}

module.exports=verifyToken