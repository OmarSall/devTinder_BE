const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;
const User = require("../models/user");

const userAuth = async (req, res, next) => {
    try {
        // read the token from the req cookies
        const cookies = req.cookies;
        // extract the token from the cookie
        const {token} = cookies;

        // validate the token
        if (!token) {
            throw new Error("Token is not valid")
        }

        const decodedObj = await jwt.verify(token, secretKey);
        const {_id} = decodedObj;

        // find the user
        const user = await User.findById(_id);

        if (!user) {
            throw new Error("User not found")
        }

        // attaching the user to the request
        req.user = user;
        next();
    } catch (err) {
        res.status(400).send("ERROR " + err.message);
    }
}

module.exports = {
    userAuth,
}