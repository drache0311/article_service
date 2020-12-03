util.getPostQueryString = function(req, res, next){
  res.locals.getPostQueryString = function(isAppended=false, overwrites={}){    
    var queryString = '';
    var queryArray = [];
    var searchType = overwrites.searchType?overwrites.searchType:(req.query.searchType?req.query.searchType:''); // 1
    var searchText = overwrites.searchText?overwrites.searchText:(req.query.searchText?req.query.searchText:''); // 1

    if(searchType) queryArray.push('searchType='+searchType); // 1
    if(searchText) queryArray.push('searchText='+searchText); // 1

    if(queryArray.length>0) queryString = (isAppended?'&':'?') + queryArray.join('&');

    return queryString;
  }
  next();
}

module.exports = util;