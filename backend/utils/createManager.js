const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("../models/User");


const ensureManager = async () => {

    const managerEmail = process.env.MANAGER_EMAIL || "manager@test.com";
    const managerPassword = process.env.MANAGER_PASSWORD || "manager123";

    const existingManager = await User.findOne({
        email: managerEmail
    });


    if (existingManager) {
        const hashedPassword = await bcrypt.hash(managerPassword, 10);

        if (existingManager.role !== "MANAGER" || existingManager.name !== "Project Manager") {
            existingManager.role = "MANAGER";
            existingManager.name = "Project Manager";
            existingManager.password = hashedPassword;
            await existingManager.save();
        }

        return existingManager;
    }

    const hashedPassword = await bcrypt.hash(managerPassword, 10);


    return User.create({

        name: "Project Manager",

        email: managerEmail,

        password: hashedPassword,

        role: "MANAGER"

    });

};


if (require.main === module) {
    const connectDB = require("../config/db");

    connectDB()
        .then(() => ensureManager())
        .then(() => {
            console.log("Manager ensured");
            mongoose.connection.close();
        })
        .catch((error) => {
            console.error(error);
            mongoose.connection.close();
            process.exit(1);
        });
}


module.exports = ensureManager;