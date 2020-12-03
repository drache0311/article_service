const express = require('express');
const Article = require('../models/article')
const router = express.Router()

router.get('/' ,(req , res) => {
  var searchQuery = await createSearchQuery(req.query);    
  var artilces = []
  if(searchQuery) {
    artilces = await Article.find(searchQuery)
      .sort('upload_day')
      .exec();
  }
  res.render('article/index', {
    artilces : artilces ,
    searchText:req.query.searchText
  })
})

router.get('/:id', async(req, res) => {
  const article = await Article.findById(req.params.id)
  if(article == null)
   res.redirect('/')
  res.render('articles/show' , {article : article}) 
})
async function createSearchQuery(queries){
  var searchQuery = {};
  if(queries.searchText && queries.searchText.length >= 2){
    var articleQueires = [];
   articleQueires.push({ body: { $regex: new RegExp(queries.searchText, 'i') } });  
  if(articleQueires.length>0) searchQuery = {$or:articleQueires};
    else searchQuery = null;
  }
  return searchQuery;
}
module.exports = router
	