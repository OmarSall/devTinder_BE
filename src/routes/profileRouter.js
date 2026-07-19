const express = require("express");
const {userAuth} = require("../middlewares/auth");
const {validateEditProfileData} = require("../utils/validation")
const bcrypt = require("bcrypt");
const validator = require('validator');

const profileRouter = express.Router();

// if the userAuth will fail the code will not be even executed
profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            throw new Error("User does not exist");
        }

        res.send(user);
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if (!validateEditProfileData(req)) {
            throw new Error("Invalid Edit Request");
            //return res.status(400).send("")
        }

        const loggedInUser = req.user;

        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

        await loggedInUser.save();

        res.json({
            message: `${loggedInUser.firstName} your profile was updated successfully!`,
            data: loggedInUser,
        });

    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
})

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const {password} = req.body;

        if (!validator.isStrongPassword(password)) {
            throw new Error("Please enter a strong password.")
        }

        const passwordHash = await bcrypt.hash(password, 10)
        loggedInUser.password = passwordHash;
        await loggedInUser.save();

        res.json({
            message: `${loggedInUser.firstName} your password was updated successfully!`,
        });

    } catch (err) {
        res.status(400).send("ERROR : " + err.message)
    }
})

module.exports = profileRouter;