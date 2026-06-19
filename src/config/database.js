const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const mongoose = require('mongoose');
require("dotenv").config();
const url = process.env.MONGOOSE_CONNECTION;

const connectDB = async () => {
    await mongoose.connect(url);
}

module.exports = connectDB()