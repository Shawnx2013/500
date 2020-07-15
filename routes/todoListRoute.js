const express = require('express');
const router = express.Router();
const ListItem = require('../models/todoListItem');

router.get('/incomplete', async (req, res)=>{
    let query = ListItem.find({ completed: 'false' }).sort({ postedAt: 'desc' });
    try{
        const items = await query.exec();
        res.send(items);
    }
    catch(e){
        console.log(e);
        res.sendStatus(500)
    }
});

router.get('/completed', async (req, res)=>{
    let query = ListItem.find({ completed: 'true' }).sort({ postedAt: 'desc' });
    try{
        const items = await query.exec();
        res.send(items);
    }
    catch(e){
        console.log(e);
        res.sendStatus(500)
    }
});

router.post('/', async (req, res)=>{
    //0console.log('POST on todolist');
    let item = new ListItem({
        content: req.body.content,
        completed: false
    });
    try{
        await item.save();
        res.sendStatus(200);
    }catch(e){
        console.log(e);
        res.sendStatus(500)
    }
});

router.put('/:id', async (req, res)=>{
    let item;
    try{
        item = await ListItem.findById(req.params.id);
        item.completed = !item.completed;
        await item.save();
        res.sendStatus(200);
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

router.put('/:id/:content', async (req, res)=>{
    let item;
    try{
        item = await ListItem.findById(req.params.id);
        item.content = req.params.content;
        await item.save();
        res.sendStatus(200);
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

router.delete('/:id', async (req, res)=>{
    let item;
    //console.log(req.params.id);
    try{
        item = await ListItem.findById(req.params.id);
        await item.remove();
        res.sendStatus(200);
    }catch(e){
        console.log(e);
        res.sendStatus(500)
    }
});


module.exports = router;