const { Router } = require("express");
const Blog = require('../models/blog');
const Comment = require('../models/comment');
const multer  = require('multer');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const router = Router();
const del_blog = require('../services/blog-delete');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads');
    },
    filename: function (req, file, cb) {
      const filename = `${Date.now()}-${file.originalname}`;
      cb(null, filename)
    }
  })

// Use the custom storage configuration
const upload = multer({ storage: storage });

router.get('/add-blog', (req,res) =>{
    if(!req.user) return res.redirect('/');
    return res.render("add-blog", {
        user: req.user,
    });
});

router.get('/:id', async (req,res) =>{
    const blog = await Blog.findById(req.params.id).populate("createdBy");
    const comments = await Comment.find({blogID : blog._id}).populate("createdBy");
    const formattedDate = moment(blog.updatedAt).format('MMMM Do YYYY, h:mm a');
    return res.render("blog", {
        user: req.user,
        blog, formattedDate,
        comments
    });
});

router.post('/:blogid', async (req, res) => {
    if(!req.body.content) return res.redirect(`/blog/${req.params.blogid}`);
    await Comment.create({
        content : req.body.content,
        createdBy : req.user._id,
        blogID : req.params.blogid,
    });
    return res.redirect(`/blog/${req.params.blogid}`);
});

router.post('/', upload.single("coverImg"), async (req,res) =>{
    const { title, body } = req.body;
    var blog;
    if (!req.file) {
        blog = await Blog.create({
            title,
            body,
            createdBy : req.user._id,
        });
        // res.render("add-blog", {
        //     error : "No File uploaded",
        // });
    }
    else
    {
        blog = await Blog.create({
            title,
            body,
            thumbnailURL : `/uploads/${req.file.filename}`,
            createdBy : req.user._id,
        });
    }
    return res.redirect(`/blog/${blog._id}`);
});

router.post('/delete/:blogid', async (req,res) =>{
    del_blog(Blog, req.params.blogid);
    res.redirect("/");
});

module.exports = router;