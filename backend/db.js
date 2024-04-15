require('dotenv').config();
const mongoose = require("mongoose");
const { string } = require("zod");

const dbconnection = process.env.MONGODB_URL

mongoose.connect( dbconnection ,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>{
    console.log('Connected to MongoDB')
}).catch((error)=>{
    console.error("Error connection to MongoDB: ", error);
});

const userSchema = new mongoose.Schema({
    userName:{
        type: String,
        required: true,
        unique:true, 
        minlength: 4,
        maxlength: 30,
        trim: true
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    password:{
        type: String,
        required: true,
        minlength: 6
    }
});

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    balance:{
        type: Number,
        required: true
    }
});

const User = mongoose.model('User',userSchema);
const Account = mongoose.model('Account', accountSchema)

module.exports = {
    User,
    Account 
};

