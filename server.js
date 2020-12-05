const express = require('express')
const mongoose = require('mongoose')
const articleRouter = require('./routes/articles')
const Article = require('./models/article')  //article 모델
const { post } = require('./routes/articles')
var util = require('./util');
const app = express()


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

// searchQuery <<<
function createSearchQuery(queries){ // 4
  var searchQuery = {};
  if(queries.searchText && queries.searchText.length >= 3){
    var postQueries = [];
      postQueries.push({ body: { $regex: new RegExp(queries.searchText, 'i') } });
    if(postQueries.length > 0) searchQuery = {$or:postQueries};
  }
  return searchQuery;
}

// Routers
app.use('/articles',util.getPostQueryString, articleRouter)

app.listen(3000)


