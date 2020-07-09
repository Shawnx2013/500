const express = require('express');
const router = express.Router();
const Photo = require('../models/photo');
const ListItem = require('../models/todoListItem');

router.get('/', async (req, res)=>{
   const curDate = new Date().toLocaleDateString();
   //console.log(curDate);
   const daysPassed = datediff(parseDate("2/14/2019"), parseDate(curDate));
   let photos, waitItems, doneItems;
   try{
      photos = await Photo.find().sort({ postedAt: 'desc' }).limit(5).exec();
      waitItems = await ListItem.find({ completed: 'false' }).sort({ postedAt: 'desc' }).exec();
      doneItems = await ListItem.find({ completed: 'true' }).sort({ postedAt: 'desc' }).exec();
   }catch(e){
      photos = [];
      waitItems = [];
      doneItems = [];
      console.log(e)
   }
   res.render('index', {
      dayCount: daysPassed,
      photos: photos,
      waitItems: waitItems,
      doneItems: doneItems
   });
});

// new Date("dateString") is browser-dependent and discouraged, so we'll write
// a simple parse function for U.S. date format (which does no error checking)
function parseDate(str) {
   var mdy = str.split('/');
   return new Date(mdy[2], mdy[0]-1, mdy[1]);
}

function datediff(first, second) {
   // Take the difference between the dates and divide by milliseconds per day.
   // Round to nearest whole number to deal with DST.
   return Math.round((second-first)/(1000*60*60*24));
}


module.exports = router;