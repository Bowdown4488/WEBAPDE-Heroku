const mongoose = require('./connectionModel').connection;

const memeSchema = mongoose.Schema({
	memeTitle: String,
    memeimage: { type: String },
    memeTag: String,
	memeOwner: String,
    memeLikes: [String],
//	memeDate: String,
//	memeDateTime: Date,
    memePrivacy:String,
    memeShared:[String],
    memeComment:[{
       commentOwner: String,
       commentString: String
    }]
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

function viewPublic(callback){
    memeModel.find({memePrivacy: "Public"}).then((list)=>
   {
        console.log("List: " + list);
        callback(list);
   })
}

function viewPublicPrivate(user, callback){
    console.log("Username: " + user);
    memeModel.find({memePrivacy: "Public"}).then((list)=>
   {
        console.log("List: " + list);
        memeModel.find({memeShared: user}).then((list2)=>
        {
            console.log("List2: " + list2);
            list = list.concat(list2);
            console.log("Concat: " + list);
            callback(list);
        })
   });
}

function addMeme(memeTitle, memeimage, memeTag, memeOwner, memePrivacy, memeShared, callback){
  const instance = memeModel({ memeTitle: memeTitle, memeimage: memeimage, memeTag: memeTag, memeOwner: memeOwner, memePrivacy: memePrivacy, memeShared: memeShared });
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

function editMeme (oldTitle, memeTitle, memeTag, memeimage, memePrivacy, memeShared){
    console.log("Old: " + oldTitle + "+ " + "New: " + memeTitle);
    memeModel.findOneAndUpdate({memeTitle: oldTitle},{
                    memeTitle: memeTitle, memeTag: memeTag, memeimage: memeimage, memePrivacy: memePrivacy, memeShared: memeShared
                  }).then();
}

function addLike(search, username){
    console.log("add function");
    memeModel.findOne({memeTitle: search}).then((memeFound) => {
      var find = 0;
       console.log("meme: " + memeFound);
      for(i=0;i<memeFound.memeLikes.length;i++){
        if(memeFound.memeLikes[i]==username)
        find = 1;
      }
      if(find == 0){
          memeModel.findOneAndUpdate({
          memeTitle: search
          },{
          $push: {memeLikes: username}
        }).then();
    }
    })
}

function pushComment(memeID, instance){
    memeModel.findOneAndUpdate({
    _id: memeID
    },{
    $push: {memeComment: instance}
  }).then();
}

module.exports.pushComment = pushComment;
module.exports.addLike = addLike;
module.exports.editMeme = editMeme;
module.exports.viewPublicPrivate = viewPublicPrivate;
module.exports.viewPublic = viewPublic;
module.exports.addMeme = addMeme;
module.exports.findOwner = findOwner;
module.exports.viewMeme = viewMeme;
module.exports.findMemes = findMemes;
module.exports.viewMyMeme = viewMyMeme;
module.exports.searchMeme = searchMeme;