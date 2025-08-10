const express=require('express')
const { connectDB } = require('./config/data')
const app=express()
const userroute=require('./routes/userroute')
require('dotenv').config()

const cors=require('cors')



app.use(cors())
app.use(express.json()) 
app.use(express.urlencoded({ extended: true })) 


app.use('/', userroute)



const PORT=(process.env.PORT)

app.listen(PORT,()=>{
    console.log(`server running on ${PORT}`)
})


connectDB()