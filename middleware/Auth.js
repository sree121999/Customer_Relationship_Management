const STATUS=require('../constants/httpstatus')
const MESSAGES=require('../constants/messages')
const jwt=require('jsonwebtoken')
require('dotenv').config()


const authmiddleware=async(req,res,next)=>{
    const token=req.header('Authorization')?.replace('Bearer ','')
    if (!token)return res.status(STATUS.BAD_REQUEST).json({message:MESSAGES.ACCESS_DENIED})

    try{
        const decode=jwt.verify(token,process.env.TOKEN)
        req.user=decode.user
        next()




    }catch(err){
        
            res.status(STATUS.INTERNAL_SERVER_ERROR).json({
                message:MESSAGES.INTERNAL_SERVER_ERROR

})
    }}

    module.exports={authmiddleware}

    
