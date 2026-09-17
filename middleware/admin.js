require('dotenv').config();
const jwt=require('jsonwebtoken');

//we can use signle  middleware 
// function middleware(password){
//     return function(req,res,next){
//           const token=req.headers.token;
//     const decoded=jwt.verify(token,process.env.JWT_ADMIN_PASSWORD);

//     if(decoded){
//         req.userId=decoded.id;
//         next();
//     }else{
//         res.json({
//             message:"you are not  signed in! "
//         })
//     }

//     }
// }

function adminMiddleware(req,res,next){
    const token=req.headers.token;
    const decoded=jwt.verify(token,process.env.JWT_ADMIN_PASSWORD);

    if(decoded){
        req.userId=decoded.id;
        next();
    }else{
        res.json({
            message:"you are not  signed in! "
        })
    }


}

module.exports={
    adminMiddleware:adminMiddleware
}