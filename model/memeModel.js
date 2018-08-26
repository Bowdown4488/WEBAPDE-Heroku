const mongoose = require('./connectionModel').connection;

const memeSchema = mongoose.Schema({
    //memeID: String,
	memeTitle: String,
    memeimage: { type: String },
//	memeTag: [{
//    tag:String
//    }],
    memeTag: String,
	memeOwner: String,
//	memeDate: String,
//	memeDateTime: Date,
    memePrivacy:String,
//    memeShared:[{
//        username:String
//    }],
//	memeComment: Number
//    ,
//	memeComment: [{
//		memeID: String,
//		commentItself: String,
//		memeOwner: String,
//		commentDate: String,
//	}]
});

const memeModel = mongoose.model('meme', memeSchema);

function viewMeme(callback){
  memeModel.find({}, function (err, list) {
    if(err) return console.error(err);
    callback(list);
  });
}

function addMeme(memeTitle, memeimage, memeTag, memeOwner, memePrivacy, callback){
  const instance = memeModel({ memeTitle: memeTitle, memeimage: memeimage, memeTag: memeTag, memeOwner: memeOwner, memePrivacy: memePrivacy });
   console.log("test");
  instance.save(function (err, inv) {
    if(err) return console.error(err);
    callback();
  });
}

 function findOwner(memeOwner){
   return memeModel.findOne({memeOwner: memeOwner});
}

 function findMemes(memeTitle){
   return memeModel.findOne({memeTitle: memeTitle});
}

module.exports.addMeme = addMeme;
module.exports.findOwner = findOwner;
module.exports.viewMeme = viewMeme;
module.exports.findMemes = findMemes;