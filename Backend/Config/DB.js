const mongoose = require("mongoose")
require("dotenv").config()

exports.DBConnection = async ()=>{
    try {
        mongoose.connect(await process.env.MONGODB_URL)
        console.log(("DB connected Successfully"))
    } catch (error) {
        console.error("DB connection Failed")
        console.error("error", error)
        process.exit(1)
    }
}