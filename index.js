const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');
const editRoute = require('./routes/editData');
const Blog = require('./models/blog');
const cookieParser = require("cookie-parser");
const { checkForAuthCookie } = require("./middleware/auth");

const app = express();
const PORT = 8000;

mongoose.connect('mongodb://localhost:27017/BlogeDB');
app.set('view engine', 'ejs');
app.set('views', path.resolve("./views"));

app.use(express.urlencoded({ extended:false }));
app.use(cookieParser());
app.use(checkForAuthCookie("token"));
app.use(express.static(path.resolve('./public')));

app.get('/', async (req, res) =>{
    const blogArr = await Blog.find();
    res.render("home", {
        user: req.user,
        blogs: blogArr,
    });
})
app.use("/user", userRoute);
app.use("/blog", blogRoute);
app.use("/user", editRoute);

app.listen(PORT, () => console.log(`Server Listening at PORT:${PORT}`));