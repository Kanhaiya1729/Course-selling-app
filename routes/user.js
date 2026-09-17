require('dotenv').config();
const { Router }=require('express');
const {z}=require('zod');
const bcrypt=require('bcrypt');
const jwt =require('jsonwebtoken');
const JWT_USER_PASSWORD="ballia123"
const userRouter=Router();
const { userModel } = require("../db");

userRouter.post("/signup",async function(req,res){
    //validate
    const requiredBody=z.object({ 
        email: z.string().trim().lowercase().email(),
        firstname:z.string(),
        lastname:z.string(),
        password:z.string().min(4)

    })
    const result=requiredBody.safeParse(req.body);
    if(!result.success){
       return res.json({
            message:"incorrect format",
            error:result.error
        })
        
    }   
  const {email,password,firstname,lastname}=result.data; 
 try{
  const hashedPass= await bcrypt.hash(password,5); //hashing password
  await userModel.create({
    email,
    firstname,
    lastname,
    password:hashedPass
  })
    res.status(201).json({
    message:"you are signed up!"
})

}catch(err){
    res.status(500).json({
        message:"signup failed!"
    })
}
});


userRouter.post("/signin",async function(req,res){
    const {email,password}=req.body;

    try{
    const user=await userModel.findOne({
        email:email,
    });
    if(!user){
       return  res.json({
            message:"incorrect credentials"
        });
    }
    const MatchPassword=await bcrypt.compare(password,user.password);
  if(!MatchPassword){
   return res.json({
        message:"incorrect credentials"
    })
  }

  const token=jwt.sign({
    id:user._id
  },
  process.env.JWT_USER_PASSWORD);

  return res.json({
        message:"you are signed in!",
        token:token
    })
  }catch(err){
    console.log(err);
    return res.status(500).json({
        message:"signin failed"
    })
     
  }
     
});
userRouter.get("/user /purchases",function(req,res){
    res.json({
        message:"you are signed in"
    })

})

module.exports={
    userRouter:userRouter
}