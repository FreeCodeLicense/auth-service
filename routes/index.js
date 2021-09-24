var express = require('express');
var router = express.Router();
const auth=require("./middlewares/isAuth")
const verifyemail=require("./middlewares/emailConfirmed")
const { User }=require("../models")

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/blog",auth,verifyemail,(req,res)=>{
  // console.log(req.user)
  res.json({ "auth" : "Confirmed" })
})

router.get("/verify/:uniquestring",async (req,res)=>{
  let { uniquestring } = req.params
  try{
    let now=new Date(Date.now())
    await User.findOneAndUpdate({ salt:uniquestring },{ emailConfirmedAt: now.toLocaleString() })
  } catch(err){
    console.log(err)
  }

  res.redirect("/")
})

module.exports = router;
