const mongoose=require('mongoose')

const customerschema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phone:{
        type:String
    },
    
   status: {
    type: String,
    enum: ["active", "inactive", "lost"],
    default: "active"
},

    assignedto:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    createdAt:{
        type:Date,
        default:Date.now
    }

})

module.exports=mongoose.model('Customer',customerschema)

