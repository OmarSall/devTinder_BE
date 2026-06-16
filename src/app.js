const express = require('express');

const app = express();

app.use(
    "/user",
    (req, res, next) => {
        console.log("Handling the route user!!")
        next();
        res.send("Response!!");  // server send the response and it will not go any further

    },
    (req, res) => {
        console.log("Handling the route user 2!!!")
        res.send("2nd Response!!")
    }
)

app.listen(3000, () => {
    console.log("Server is successfully listening on port 3000...")
});