const express = require("express")
require("dotenv").config()
const DB = require("./Config/DB")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

const PORT = process.env.PORT || 4000

// DB Connection
DB.DBConnection()


app.use(express.json())
app.use(cookieParser())
app.use(
    cors({
        origin: "http://localhost:5173",
        credential: true
    })
)

app.get("/", (req, res)=> {
    res.send("App is running")
})

app.listen(PORT, ()=>{
    console.log(`App is running at ${PORT}`)
})