const express = require('express')
const mongoose = require('mongoose')
const articleRouter = require('./routes/articles')
const Article = require('./models/article')  //article 모델
const { post } = require('./routes/articles')
const app = express()
var util = require('util')

mongoose.connect('mongodb://developer:developer@207.148.99.250:27017/article_service', {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
})
app.set('view engine', 'ejs')
//app.use(express.unlencoded(d{ extended : false }))



app.get('/', async (req, res) => {
  var searchQuery = createSearchQuery(req.query);
    const articles = await Article.find(searchQuery).sort({ upload_day: 'desc' })  
    res.render('articles/index', { articles: articles })
})



function createSearchQuery(queries){ // 4
  var searchQuery = {};
  if( queries.searchText && queries.searchText.length >= 2){
    var articlesQueries = [];
      postQueries.push({ title_kor: { $regex: new RegExp(queries.searchText, 'i') } });
    if(articlesQueries.length > 0) searchQuery = {$or:articlesQueries};
  }
  return searchQuery;
}

app.use('/articles', articleRouter)

app.listen(3000)


