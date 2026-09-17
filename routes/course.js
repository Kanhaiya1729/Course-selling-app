const { Router }=require('express');
const courseRouter=Router();

courseRouter.post("/purchase",function(req,res){
    res.json({
        message:"you are signed in"
    })

})
courseRouter.get("/preview",function(req,res){
    res.json({
        message:"course preview"
    })

})

module.exports={
    courseRouter:courseRouter

}