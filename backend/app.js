require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mainRouter = require("./routes/index");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());


app.use("/api/v1", mainRouter)


const port = 3000;
app.listen(port,()=>{
    try {
        console.log(`Server is running on port ${port}`)
    } catch (error) {
        console.dir(error);
    }
})


