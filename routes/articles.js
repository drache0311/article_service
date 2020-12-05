const express = require('express')
const Article = require('./../models/article')
const router = express.Router()

router.get('/new' ,(req , res) => {
    res.send('hiddd')
  //res.sender('articles/new', {article : new Article()})
})

router.get('/:id', async(req, res) => {
  const article = await Article.findById(req.params.id)
  if(article == null)
   res.redirect('/')
  res.render('articles/show' , {article : article}) 
})
// 검색 눌렀을 때 이걸로 실행되는 듯
router.get('/', async (req, res) => {
  var searchQuery = createSearchQuery(req.query);
    // searchQuery에 검색한 Text 들어있는듯 한데 이걸 modles의 article에 title이나 plain_text랑 어떻게 비교해???
    // 비교해서 밑에 articles에 똑같이 Article.find해서 넣어주면 검색한 기사만 나올 것 같앙
    const articles = await Article.find(searchQuery).sort({ upload_day: 'desc' })  
    res.render('articles/index', { articles: articles })
})
// searchQuery <<< 이건 server.js랑 양쪽 둘다 있어야 댈듯 (지우면 실행 안대드라고)
function createSearchQuery(queries){ // 4
  var searchQuery = {};
  if(queries.searchText && queries.searchText.length >= 3){
    var postQueries = [];
      postQueries.push({ body: { $regex: new RegExp(queries.searchText, 'i') } });
    if(postQueries.length > 0) searchQuery = {$or:postQueries};
  }
  return searchQuery;
}

module.exports = router
