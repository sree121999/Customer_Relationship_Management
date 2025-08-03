const mongoose=require('mongoose')

const caseschema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,

    },
    customer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Customer',
        
    },
    
    status:{
        type:String,
        enum:['open','inprogress','resolved','closed'],
        default:'open'
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

module.exports=mongoose.model('case',caseschema)