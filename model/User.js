const mongoose=require('mongoose')

const userschema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["admin","sale","support"],
        required:true
    },
    status:{
        type:String,
        enum:["active","inactive"],
         default: "active",
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports=mongoose.model('User',userschema)