const mongoose=require('mongoose')
const STATUS=require('../constants/httpstatus')
const MESSAGES=require('../constants/messages')
const Case = require('../model/Case')
const User=require('../model/User')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
require('dotenv').config()



const Customer = require("../model/Customer")

const getallcustomers=async(req,res)=>{
    try{
        const customers=await Customer.find()
        res.status(STATUS.OK).json(customers)

    }catch(err){
        res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            message:MESSAGES.INTERNAL_SERVER_ERROR
        })

    }

}

const createcustomer=async(req,res)=>{
    
    const{name,email,phone}=req.body
    try{
        const user=await Customer.findOne({email})
        if(user)return res.status(STATUS.BAD_REQUEST).json({message:MESSAGES.CUSTOMER_EXISTING})
            
        const created= await Customer.create({name,email,phone,})
        
        res.status(STATUS.CREATED).json({created,message:MESSAGES.CUSTOMER_CREATED_SUCCESSFULLY})
       

    }catch(err){
        
        res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            message:MESSAGES.INTERNAL_SERVER_ERROR
        })

    }

}

const updatecustomer=async(req,res)=>{
    
    
    const{name,email,phone}=req.body
    try{

        if(!name || !email || !phone)
            return res.status(STATUS.NOT_FOUND).json({message:MESSAGES.FIELDS_ARE_REQUIRED})

        const customerid= req.params.id
        const updated=await Customer.findByIdAndUpdate(customerid,{name,email,phone},{new:true,runValidators:true})
        res.status(STATUS.OK).json({updated,message:MESSAGES.CUSTOMER_UPDATED})
       

    }catch(err){
        
        res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            message:MESSAGES.INTERNAL_SERVER_ERROR
        })

    }

}

const deletecustomer=async(req,res)=>{
    
    
    
    try{

        const customerid= req.params.id
        const deleted=await Customer.findByIdAndDelete(customerid)
        res.status(STATUS.OK).json({deleted,message:MESSAGES.CUSTOMER_DELETED})
       

    }catch(err){
        
        
        res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            message:MESSAGES.INTERNAL_SERVER_ERROR
        })

    }

}










const createcase=async(req,res)=>{
    

     const { title, description, status, customer,assignedto } = req.body
     if(!title || !description || !status || !assignedto ||!customer)return res.status(STATUS.BAD_REQUEST).json({message:MESSAGES.FIELDS_ARE_REQUIRED})
    
    
    try{
      const createdCase = await Case.create({
            title,
            description,
            status,
            assignedto,
        
            customer
        })

        const caseWithDetails = await Case.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(createdCase._id)
                }
            },


        {
            $lookup:{
                from:'users',
                localField:'assignedto',
                foreignField:'_id',
                as:'assigneduser'
            }
        },
        {$lookup:{
            from:'customers',
            localField:'customer',
            foreignField:'_id',
            as:'customerinfo'

        }},
        {
            $project:{
                title:1,
                description:1,
                status:1,
                
                'customerinfo._id':1,
                'customerinfo.name':1,
                'customerinfo.email':1,
                'customerinfo.phone':1,

                'assigneduser._id':1,
                'assigneduser.name':1,
                'assigneduser.email':1,


            }
        }


       ])

       res.status(STATUS.CREATED).json(caseWithDetails[0] || createdCase)



        

    }catch(err){
        

        
        res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            message:MESSAGES.INTERNAL_SERVER_ERROR
        })

    }

}



const updatecase=async(req,res)=>{
    
    
    try{
        const caseid=req.params.id
            const{title,description,phone,status,assignedto}=req.body
            
            const updated=await Case.findByIdAndUpdate(caseid,{title,description,status,phone,assignedto},{new:true,runValidators:true}).populate('customer')
            res.status(STATUS.OK).json(updated)

        
        

    }catch(err){
        
        res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            message:MESSAGES.INTERNAL_SERVER_ERROR
        })

    }

}




const registeruser=async(req,res)=>{
    
    
    
    

    
    
    const{name,email,password,phone,role,status}=req.body
    if (!name || !email || !password || !phone || !role) {
    return res.status(400).json({ message: "Missing required fields" })}
     
    
    
    try{
        const user=await User.findOne({email})
        if(user)return res.status(STATUS.BAD_REQUEST).json({message:MESSAGES.USER_ALREADY_REGISTERD})
        const hashedpassword=await bcrypt.hash(password,10)

        const register=await User.create({name,email,password:hashedpassword,phone,role,status})
        
        res.status(STATUS.CREATED).json({register,message:MESSAGES.USER_REGISTERD})
       
        
        

    }catch(err){
         
        
         
        
       
        
        
        res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            message:MESSAGES.INTERNAL_SERVER_ERROR
            
        })

    }

}


const loginuser=async(req,res)=>{
    
    
    
    
    const{email,password,}=req.body
    
    
    try{

        const user=await User.findOne({email})
        if(!user) return res.status(STATUS.BAD_REQUEST).json({message:MESSAGES.INVALID_CREDENTIALS})

            const payload={user:{id:user._id}}
            const token=jwt.sign(payload,process.env.TOKEN,{expiresIn:'1h'})

        const ismatch=await bcrypt.compare(password,user.password)
        if(!ismatch) return res.status(STATUS.BAD_REQUEST).json({message:MESSAGES.INVALID_CREDENTIALS,})
            res.status(STATUS.CREATED).json({message:MESSAGES.LOGIN_SUCCESSFULLY,token})
        
        
        
        

    }catch(err){
        

       
        
        
        
        
        res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            message:MESSAGES.INTERNAL_SERVER_ERROR
        })

    }

}



const checkEmailExists = async (req, res) => {
  const { email } = req.query;
  try {
    const user = await User.findOne({ email });
    res.status(200).json({ exists: !!user });
  } catch (err) {
    
    res.status(500).json({ message: "Server error" });
  }
};


const getprofile = async (req, res) => {
  
  try {

    const user=await User.findById(req.user.id)
    
    res.json({message:'success',user})
    

   
  } catch (err) {
    console.log(err)
    
    res.status(500).json({ message: "Server error" });
  }
}

const getallcases = async (req, res) => {
  try {
    const cases = await Case.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "assignedto",
          foreignField: "_id",
          as: "assigneduser"
        }
      },
      {
        $lookup: {
          from: "customers",
          localField: "customer",
          foreignField: "_id",
          as: "customerinfo"
        }
      },
      {
        $project: {
          title: 1,
          description: 1,
          status: 1,
          createdAt: 1,
          'assigneduser._id': 1,
          'assigneduser.name': 1,
          'assigneduser.email': 1,
          'customerinfo._id': 1,
          'customerinfo.name': 1,
          'customerinfo.email': 1,
          'customerinfo.phone': 1
        }
      }
    ])
    res.status(STATUS.OK).json({ cases })
  } catch (err) {
    console.error(err)
    res.status(STATUS.INTERNAL_SERVER_ERROR).json({
      message: MESSAGES.INTERNAL_SERVER_ERROR
    })
  }
}

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'name role _id'); // Select only needed fields
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
}

const getcustomerbyid = async (req, res) => {
    try {
        const { id } = req.params;
        const customer = await Customer.findById(id);
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        res.json(customer);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const getcasebyid = async (req, res) => {
  try {
    const { id } = req.params;

    const caseData = await Case.findById(id)
      .populate("customer", "name email")     // populate customer name & email
      .populate("assignedto", "name role");   // populate assigned user name & role

    if (!caseData) {
      return res.status(STATUS.NOT_FOUND).json({ message: "Case not found" });
    }

    res.status(STATUS.OK).json(caseData);
  } catch (err) {
    console.error(err);
    res.status(STATUS.SERVER_ERROR).json({ message: "Error fetching case" });
  }
};




module.exports={getallcustomers,createcase,updatecase,createcustomer,updatecustomer,deletecustomer,registeruser,loginuser,checkEmailExists,getprofile,getallcases,getAllUsers,getcustomerbyid,getcasebyid}