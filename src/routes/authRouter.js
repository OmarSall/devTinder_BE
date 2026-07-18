const express = require("express")
const {validateSignUpData} = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const authRouter = express.Router();

authRouter.post("/signup", async (req,res) => {

    try {
        // Data Validation
        validateSignUpData(req);

        // Encrypt the password
        const {firstName, lastName, emailId, password} = req.body;
        const passwordHash = await bcrypt.hash(password, 10)

        // Creating a new instance of a user model
        const user = new User(
            {
                firstName,
                lastName,
                emailId,
                password: passwordHash,
            }
        );

        await user.save();
        res.send("User Added successfully!")
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        const {emailId, password} = req.body;

        const user = await User.findOne({ emailId: emailId })

        if (!user) {
            throw new Error("Invalid credentials")
        }
        const isPasswordValid = await user.getJWT();

        if (isPasswordValid) {

            // Create a JWT
            const token = await user.getJWT();

            // Add the token to cookie and send the response back to the user
            res.cookie("token", token,
                {
                    expires: new Date(Date.now() + 8 * 3600000)
                });
            res.send("Login successful!!!")
        } else {
            throw new Error("Invalid credentials");
        }
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
})

module.exports = authRouter;