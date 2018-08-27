const mongoose = require('./connectionModel').connection;

const memeSchema = mongoose.Schema({
	memeTitle: String,
    memeimage: { type: String },
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
   console.log("Adding meme" + {memeTag: memeTag});
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

 function viewMyMeme(memeOwner, callback){
    console.log("Title: "+ memeOwner);
   memeModel.find({memeOwner: memeOwner}).then((list)=>
   {
        console.log("List: " + list);
       callback(list);
   });
}   

function searchMeme (memeTag, callback){
       console.log("Search substring: "+ memeTag);
       memeModel.find({memeTag: {$regex: memeTag, $options: 'i'}}).then((list)=>
        {
            console.log("List: " + list);
            callback(list);
        });
}





module.exports.addMeme = addMeme;
module.exports.findOwner = findOwner;
module.exports.viewMeme = viewMeme;
module.exports.findMemes = findMemes;
module.exports.viewMyMeme = viewMyMeme;
module.exports.searchMeme = searchMeme;