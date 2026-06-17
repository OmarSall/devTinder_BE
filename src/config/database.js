const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const mongoose = require('mongoose');
const url = "mongodb+srv://omarsalloum08:M08wVHRqBoxuYsZN@omarito.jiddg2a.mongodb.net/devTinder"

const connectDB = async () => {
    await mongoose.connect(url);
}

module.exports = connectDB()