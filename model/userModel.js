const mongoose = require('./connectionModel').connection;

const userSchema = mongoose.Schema({
	username : String,
	password : String,
    image: { type: String },
    email: String,
    userBio: String,
	meme: [{
//		memeID: String,
		memeTitle: String,
        memeimage: { type: String },
        memeTag: String,
//		memeTag: [{
//            tag:String
//            }],
		memeOwner: String,
//		memeDate: String,
//        memeDateTime: Date,
        memePrivacy:String,
//		commentNumber: Number
	}]
//    ,
//	memeComment: [{
//		commentID: String,
//		commentItself: String,
//		commentOwner: String,
//		commentDate: String,
//	}]
});
const userModel = mongoose.model('user', userSchema);

function addUser(username, password, image, email, userBio, callback){
  const instance = userModel({ username: username, password: password, image: image, email: email, userBio: userBio });
   console.log("test");
  instance.save(function (err, inv) {
    if(err) return console.error(err);
    callback();
  });
}

 function findOne(username){
   return userModel.findOne({username: username}); 
}

 module.exports.findOne = findOne;   
 module.exports.addUser = addUser;