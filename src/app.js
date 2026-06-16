const express = require('express');

const app = express();

app.get("/user", (req,res) => {
    res.send({firstName: "Omar", lastName: "Saini"})
});

app.post("/user", (req, res) => {
    console.log("Save Data to the database");
    res.send("Data successfully saved to the database!")
})

app.delete("/user", (req, res) => {
    res.send("Deleted successfully.")
})

app.use("/test",(req, res) => {
    res.send("Test from the server");
})

app.use("/hello",(req, res) => {
    res.send("Hello from the server");
})

app.use("/",(req, res) => {
    res.send("Hello from the dashboard");
})

app.listen(3000, () => {
    console.log("Server is successfully listening on port 3000...")
});