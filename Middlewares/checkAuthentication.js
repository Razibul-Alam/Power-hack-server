const jsonToken=require('jsonwebtoken')
const checkAuthentication=(req,res,next)=>{
    const {authenticationInfo}=req.headers;
    const authToken=authenticationInfo.split('')[1]
    const decode=jsonToken.verify((authToken,process.env.TOKEN_SECRET))
}
module.exports=checkAuthentication;