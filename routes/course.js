const { Router }=require('express');
const courseRouter=Router();
const {userMiddleware}=require("../middleware/user");
const {purchaseModel, courseModel}=require("../db")
courseRouter.post("/purchase",userMiddleware, async function(req,res){
    const userId=req.userId;
    const courseId=req.body.courseId;
    //check user had paid 
    await purchaseModel.create({
        userId,
        courseId
    })
    res.json({
        message:"you have succesfully bought this course ! "
    })

})
courseRouter.get("/preview",async function(req,res){
    const course=await courseModel.find({});

    res.json({
        message:"course preview",
        course:course
    })

})

module.exports={
    courseRouter:courseRouter

}