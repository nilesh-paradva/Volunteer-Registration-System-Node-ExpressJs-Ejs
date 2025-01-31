const express = require("express");
const fs = require("fs");
const app = express();
const bodyParser = require("body-parser");
const port = 3001;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));

let localData = [];

app.get("/", (req, res) => {
    res.render("index", {localData});
});

app.post("/add", (req, res) => {
    const  {name, email, phone, skills}  = req.body;
    
    const obj = {
        name,
        email,
        phone,
        skills,
        id: Math.floor(Math.random() * 10000)
    };
    localData.push(obj);
    fs.appendFileSync('log/log.txt', `${JSON.stringify(obj)}\n`, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log("data saved");
    });
    res.redirect("/");
    console.log("volunteer added");
});

app.get("/update/:id", (req, res) => {
    const item = localData.find((item) => item.id == req.params.id);
    res.render("edit", {item});
});

app.post("/update/:id", (req, res) => {
    const id = req.params.id;
    const updatedData = req.body;
    localData = localData.map((item) => item.id == id ? {...item, ...updatedData} : item);
    res.redirect("/");
    console.log("volunteer updated");
    
});

app.get("/delete/:id", (req, res) => {
    localData = localData.filter((item) => item.id != req.params.id);
    res.redirect("/");
    console.log("volunteer deleted");
});

app.listen(port, (req, res) => {
    console.log(`Server is running on port ${port}`, `http://localhost:${port}`);
    fs.writeFile('log/log.txt', '', () => console.log('file data Cleared'));
});