const express = require("express")
const bodyParser = require("body-parser")

const PORT = process.env.PORT || 7777

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

require('./routes')(app)

app.listen(PORT,()=>{
    console.log(`server is running successfully on http://localhost:${PORT}`);
})