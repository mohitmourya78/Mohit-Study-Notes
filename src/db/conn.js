const mongoose = require("mongoose");
require("dotenv").config()


/*mongoose.connect("mongodb://localhost:27017/registration", {
     
    }).then(()=>{
    console.log("connection sucessfull")
}).catch((e)=>{
    console.log(e)
})*/


mongoose.connect(process.env.MONGODB_URI, {
     
    }).then(()=>{
    console.log("connection sucessfull")
}).catch((e)=>{
    console.log(e)
})

