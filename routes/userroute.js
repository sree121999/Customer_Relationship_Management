const express=require('express')
const { getallcustomers, createcase, updatecase, createcustomer, updatecustomer, deletecustomer, registeruser, loginuser} = require('../controller/usercontroll')
const routes=express.Router()



routes.get('/getallcustomers',getallcustomers)

routes.post('/createcustomer',createcustomer)

routes.put('/updatecustomer:id',updatecustomer)

routes.delete('/deletecustomer/:id',deletecustomer)


routes.post('/createcase',createcase)

routes.put('/updatecase:id',updatecase)

routes.post('/registeruser',registeruser)

routes.post('/loginuser',loginuser)


module.exports=routes