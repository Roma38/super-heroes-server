var mongoose = require("mongoose");

var heroSchema = mongoose.Schema({
  nickname: {
    type: String,
    required: true,
    unique: true
  },
  realName: String,
  description: String,
  superPowers: String,
  catchPhrase: String,
  images: [String]
});

module.exports = mongoose.model("Hero", heroSchema);
