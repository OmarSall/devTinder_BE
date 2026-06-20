const express = require('express');
const connectDB = require("./config/database")
const app = express();
const User = require("./models/user");

app.use(express.json());

app.post("/signup", async (req,res) => {
    // creating a new instance of a user model
    const user = new User(req.body);

    try {
        await user.save();
        res.send("User Added successfully!")
    } catch (err) {
        res.status(400).send("Error saving the user:" + err.message);
    }
})

// get user by email
app.get("/user", async (req, res) => {
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

