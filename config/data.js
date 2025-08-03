const mongoose=require('mongoose')
require('dotenv').config()

const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log('db connected successfully')
    }catch(err){
        console.log(err)
    }
}

module.exports={connectDB}
