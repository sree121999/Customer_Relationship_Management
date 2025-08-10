const express=require('express')
const { getallcustomers, createcase, updatecase, createcustomer, updatecustomer, deletecustomer, registeruser, loginuser,checkEmailExists, getprofile, getallcases, getAllUsers, getcustomerbyid, updatecaseById, getcasebyid} = require('../controller/usercontroll')
const routes=express.Router()
const {authmiddleware}=require('../middleware/Auth')



routes.get('/getallcustomers', authmiddleware,getallcustomers)

routes.post('/createcustomer',authmiddleware,createcustomer)



routes.put("/updatecustomer/:id", authmiddleware, updatecustomer);
;


routes.delete('/deletecustomer/:id',authmiddleware,deletecustomer)


routes.post('/createcase',authmiddleware,createcase)

routes.put('/updatecase/:id',authmiddleware,updatecase)

routes.post('/registeruser',registeruser)

routes.post('/loginuser',loginuser)

routes.get("/checkEmail",checkEmailExists)

routes.get("/getprofile",authmiddleware,getprofile)


routes.get("/getallcases",authmiddleware,getallcases)

routes.get("/getallusers",authmiddleware,getAllUsers)

routes.get("/getcustomerbyid/:id", authmiddleware, getcustomerbyid)

routes.get("/getcasebyid/:id", authmiddleware, getcasebyid)



module.exports=routes