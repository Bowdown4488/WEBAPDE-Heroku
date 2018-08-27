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

function editUserMeme(username, id, memeTitle, memeTag, memeimage, memePrivacy, memeShared){
    console.log("Username: " + username);
    userModel.findOne({username:username
    }).then((foundUser) => {
        if(foundUser){
            for(let i = 0; i < foundUser.meme.length;i++){
                console.log(foundUser.meme);
                console.log(foundUser.meme._id + 'Compare with: ' + id);
                if(foundUser.meme[i]._id == id){
                    console.log('Found the meme');
                    console.log("Old: " + memeTitle);
                    console.log("Old: " + memeTag);
                    console.log("Old: " + memeImage);
                    console.log("Old: " + memePrivacy);
                    console.log("Old: " + memeShared);
                    foundUser.meme[i].memeTitle = memeTitle;
                    foundUser.meme[i].memeTag = memeTag;
                    foundUser.meme[i].memeImage = memeImage;
                    foundUser.meme[i].memePrivacy = memePrivacy;
                    console.log("New: " + foundUser.meme[i].memeTitle);
                    console.log("New: " + foundUser.meme[i].memeTag);
                    console.log("New: " + foundUser.meme[i].memeImage);
                    console.log("New: " + foundUser.meme[i].memePrivacy);
                }
                else{console.log("Meme not found")};
            }
             foundUser.save().then(); //not effecient fix later
        }
        else{
            console.log("No User");
        }
    })
}

 module.exports.editUserMeme = editUserMeme;
 module.exports.findOne = findOne;   
 module.exports.addUser = addUser;