const express = require('express')
const Article = require('./../models/article')
const router = express.Router()

router.get('/new' ,(req , res) => {
    res.send('hi')
  //res.sender('articles/new', {article : new Article()})
})

router.get('/:id', async(req, res) => {
  const article = await Article.findById(req.params.id)
  if(article == null)
   res.redirect('/')
  res.render('articles/show' , {article : article}) 
})


module.exports = router
