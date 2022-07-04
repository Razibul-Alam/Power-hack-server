const jsonToken=require('jsonwebtoken')
const checkAuthentication=(req,res,next)=>{
    const {jtoken}=req.headers;
    const authToken=jtoken.split(' ')[1]
    const decode=jsonToken.verify(authToken,process.env.TOKEN_SECRET)
    next()
}
module.exports=checkAuthentication;