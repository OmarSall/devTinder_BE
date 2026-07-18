const express = require('express');
const connectDB = require("./config/database")
const app = express();
const User = require("./models/user");
const {validateSignUpData} = require("./utils/validation")
const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken")
const secretKey = process.env.SECRET_KEY
const { userAuth } = require("./middlewares/auth")

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req,res) => {

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
})

app.post("/login", async (req, res) => {
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
// if the userAuth will fail the code will not be even executed
app.get("/profile", userAuth, async (req, res) => {
    try {
        const user = req.user;
        if(!user) {
            throw new Error("User does not exist");
        }

        res.send(user);
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
})

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
    const user = req.user;
    res.send(user.firstName + " sent the connection request!")
})

// get user by email, using middleware userAuth, the code inside .get will not be even
// executed when for example there is no token
app.get("/user", userAuth, async (req, res) => {
    const userEmail = req.body.emailId;

    try {
        const users = await User.findOne({ emailId: userEmail });

        if (users.length === 0) {
            res.status(404).send("User Not Found")
        } else {
            res.send(users);
        }
    }
    catch (err) {
        res.status(400).send("Something went wrong")
    }
})

// Feed API - GET /feed - get all the users from the db
app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users)
    }
    catch (err) {
        res.status(400).send("Something went wrong")
    }
})

// Delete a user from the db
app.delete("/user", async (req,res) => {
    const userId = req.body.userId
    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) return res.status(404).send("User not found");
        res.send("User deleted successfully.")
    } catch (err) {
        res.status(400).send("Something went wrong");
    }
})

// Update data of the user
app.patch("/user", async (req, res) => {
    const userId = req.body.userId;
    const data = req.body;

    try {
        const ALLOWED_UPDATES = [
            "photoUrl", "about", "gender", "age", "skills", "userId"
        ];

        const isUpdateAllowed = Object.keys(data).every((k) =>
            ALLOWED_UPDATES.includes(k)
        );

        if(!isUpdateAllowed) {
            throw new Error("Update not allowed")
        }

        await User.findByIdAndUpdate({ _id: userId } ,data, {
            returnDocument: "after",
            runValidators: true,
        });
        res.send("User updated successfully")
    } catch (err) {
        res.status(400).send("UPDATE FAILED: " + err.message);
    }
})

connectDB
    .then(() => {
        console.log("Database connection established...")
        app.listen(3000, () => {
            console.log("Server is successfully listening on port 3000...")
        });
    })
    .catch(err => {
    console.error("Database cannot be connected: ", err)
})

