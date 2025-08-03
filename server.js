const express=require('express')
const { connectDB } = require('./config/data')
const app=express()
const userroute=require('./routes/userroute')
require('dotenv').config()
const { authmiddleware } = require('./middleware/Auth')


app.use(express.json())
app.use('/', authmiddleware, userroute)



const PORT=(process.env.PORT)

app.listen(PORT,()=>{
    console.log(`server running on ${PORT}`)
})


connectDB()