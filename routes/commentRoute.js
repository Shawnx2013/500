const express = require('express');
const router = express.Router();

const Comment = require('../models/comment');

router.get("/", async (req, res)=>{
    renderCommentPage(res)
});

router.post("/", async (req, res)=>{
    let comment = new Comment({
        content: req.body.content,
        author: req.body.author
    });
    try{
        await comment.save();
        res.redirect('/comments')
    }catch(e){
        console.log(e);
        renderCommentPage(res, true)
    }
});


router.delete("/:id", async (req, res)=>{
    let Comment;
    try{
        Comment = await Comment.findById(req.params.id);
        await Comment.remove();
        res.redirect('/comments');
    }catch{
        if(!Comment){
            res.redirect('/')
        }
        else{
            res.redirect(`/comments/${author.id}`)
        }
    }
});

async function renderCommentPage(res, hasError = false){
    try{
        const comments = await Comment.find();
        res.render('comment/index', {
            comments: comments
        })
    }
    catch(e){
        res.redirect('/')
    }
}

module.exports = router;