const mongoose = require('mongoose')
const articleSchema = new mongoose.Schema({
  title : {
    type: String
  },
  title_kor : {
    type: String
  },
  href : {
    type : String
  },
  upload_day : {
    type: Date,
    default : () => Date.now
  }
})

module.exports = mongoose.model('article',articleSchema)