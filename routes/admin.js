require("dotenv").config();
const {Router}=require('express');
const {adminModel, courseModel}=require("../db")
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const {z}=require('zod');
const JWT_ADMIN_PASSWORD="beta2345"
const adminRouter=Router();
const {adminMiddleware}=require("../middleware/admin")

adminRouter.post("/signup",async function(req,res){
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
  await adminModel.create({
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

adminRouter.post("/signin",async function(req,res){
   const {email,password}=req.body;

    try{
    const user=await adminModel.findOne({
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
  },process.env.JWT_ADMIN_PASSWORD);

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


adminRouter.post("/course",adminMiddleware, async function(req,res){
    const adminId=req.userId;
    const {title,description,imageUrl,price}=req.body;
    const course= await courseModel.create({
        title,
        description,
        imageUrl:imageUrl,
        price,
        creatorId:adminId

    })
    res.json({
        message:"course created",
        courseId:course._id

    })

})
adminRouter.put("/course",adminMiddleware, async function(req,res){
    const adminId=req.userId;
    const {courseId,title,description,imageUrl,price}=req.body;

    const course= await courseModel.updateOne({
        _id:courseId,
        creatorId:adminId},
        {
        title:title,
        description:description,
        imageUrl:imageUrl,
        price,
        creatorId:adminId
        

    })
    res.json({
        message:"course updated",
        courseId:course._id

    })

})
adminRouter.get("/course/bulk",adminMiddleware,async function(req,res){
        const adminId=req.userId;
        const course= await courseModel.find({
        creatorId:adminId});
        res.json({
        message:"course updated",
        course:course

    })
    
})

module.exports={
    adminRouter:adminRouter
}