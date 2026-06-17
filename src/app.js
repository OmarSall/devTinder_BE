const express = require('express');

const app = express();

app.get("/user", (req, res) => {
    try {
        // Logic of DB call and get user data

        throw new Error("irbgfsir");

        res.send("User Data Sent");
    } catch (error) {
        res.status(500).send("Some Error, contact support team")
    }
})

app.use("/", (error, req, res, next) => {
    if  (err) {
        // Log your errors
        res.status(500).send("something went wrong")
    }
})

app.listen(3000, () => {
    console.log("Server is successfully listening on port 3000...")
});