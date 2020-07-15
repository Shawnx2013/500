const express = require('express');
const router = express.Router();
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

const Photo = require('../models/photo');

router.get("/", async (req, res)=>{
   let query = Photo.find();
   try{
      const photos = await query.exec();
      res.render('photo/index', {
         photos: photos,
      })
   }
   catch(e){
      res.redirect('/')
   }
});

router.get("/new", (req, res)=>{
   renderNewPhotoPage(res, new Photo(), false)
});

router.post("/new", async (req, res)=>{
   const photo = new Photo({
      description: req.body.description
   });
   savePhoto(photo, req.body.image);
   try{
      const newPhoto = await photo.save();
      res.redirect('/photos')
   }catch(e){
      renderNewPhotoPage(res, photo,true)
   }
});

router.get("/:id", async (req, res)=>{
   try{
      const photo = await Photo.findById(req.params.id);
      res.render('photo/show', {
         photo: photo
      })
   }catch(e){
      res.redirect('/')
   }
});

router.delete("/:id", async (req, res)=>{
   let photo;
   try{
      photo = await Photo.findById(req.params.id);
      await photo.remove();
      res.redirect('/photos');
   }catch{
      if(!photo){
         res.redirect('/')
      }
      else{
         res.redirect(`/photos/${author.id}`)
      }
   }
});

async function renderNewPhotoPage(res, photo, hasError = false){
   try{
      const params = {
         photo: photo
      };
      if(hasError)
         params.errorMessage = '添加照片时出现错误';
      res.render('photo/new', params)
   }catch{
      res.redirect('/photos');
   }
}

function savePhoto(photo, imageEncoded){
   if(imageEncoded == null) return;
   const image = JSON.parse(imageEncoded);
   if(image !=null && imageMimeTypes.includes(image.type)){
      photo.image = new Buffer.from(image.data, 'base64');
      photo.imageType = image.type;
   }
}

module.exports = router;