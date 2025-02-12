const { Router } = require("express");
const multer  = require('multer');
const User = require('../models/user');
const Blog = require('../models/blog');
const Comment = require('../models/comment');
const fs = require('fs');
const path = require('path');
const del_blog = require('../services/blog-delete');
const router = Router();

router.get('/signin', (req,res) =>{
    return res.render("signin");
});

router.get('/signup', (req,res) =>{
    return res.render("signup");
});

router.post('/signin', async (req,res) =>{
    const { email, password } = req.body;
    try {
        const token = await User.matchPasswordAndGenerateToken(email, password);
        return res.cookie("token", token).redirect("/");
    } catch (error) {
        return res.render("signin", {error: "Incorrect Email or Password" });
    } 
});

router.get('/logout', (req,res) =>{
    res.clearCookie('token').redirect("/");
});

router.get('/profile/:id', async (req, res) =>{
    const user_data = await User.findById(req.params.id);
    const blogs = await Blog.find({createdBy : req.params.id});
    res.render("profile", {
       user : req.user, user_data, blogs 
    });
});

router.post('/signup', async (req,res) =>{
    const { fullName, email, password } = req.body;
    console.log(req.body);
    await User.create({
        fullName,
        email,
        password,
    });
    return res.redirect("/");
});

router.post('/delete/:user_id', async (req,res) =>{
    try // valid user delete
    {
        console.log(req.user);
        if(req.user._id == req.params.user_id)
        {
            const user_data = await User.findById(req.user._id);
            const blogs = await Blog.find({createdBy : req.user._id}); 
            const comments = await Comment.find({createdBy : req.user._id});  

            blogs.forEach(blog => {
                del_blog(Blog, blog._id);
            });

            comments.forEach(comment => {
                del_blog(Comment, comment._id);
            });
            
            const fileurl = user_data.profileImageURL;
            if (fileurl && fileurl !== "/images/default.png")
            {   
                const oldImagePath = path.join(__dirname, '..', 'public', fileurl);
                //delete old image
                if (fs.existsSync(oldImagePath))
                {
                fs.unlink(oldImagePath, (err) => {
                    console.log(oldImagePath);
                    if (err) {
                        console.log('Error deleting old image:', err);
                    } else {
                        console.log('Old image deleted successfully');
                    }
                    });
                }
            }
            const result = await User.findByIdAndDelete(req.user._id);
            console.log(result);
            if (result) {
                console.log('Document deleted:', result);
                return res.clearCookie('token').redirect("/");
            } else {
                console.log('No document found with the given ID');
            }
        }
        
    }
    catch(error)
    {
        console.error('Error deleting document:', error);
    }
    return res.redirect("/");
});
module.exports = router;