const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("../models/User");
const connectDB = require("../config/db");


const createManager = async()=>{

    await connectDB();


    const password = await bcrypt.hash(
        "manager123",
        10
    );


    await User.create({

        name:"Project Manager",

        email:"manager@test.com",

        password,

        role:"MANAGER"

    });


    console.log("Manager created");

    mongoose.connection.close();

};


createManager();