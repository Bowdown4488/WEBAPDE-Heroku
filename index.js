const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000;
const bodyparser = require('body-parser')
const session = require("express-session")
const mongoose = require("mongoose") 
const cookieparser = require("cookie-parser")
const formidable = require('formidable'); 
const fs = require('fs');
const crypto = require("crypto"); 

//const fs = require('file-system')//for files
//const multer = require('multer') //for uploading files

//Heroku MLab database connection  
mongoose.connect('mongodb://webapde-meme:memefactory1@ds115762.mlab.com:15762/heroku_fqhtqr64', //mongodb://localhost:27017/memeDB 
{
    useNewUrlParser: true 
});

const server = express();

const urlencoder = bodyparser.urlencoded({
	extended: false
})

server.set('view engine', 'ejs');
server.use(express.static(__dirname + '/public'));
server.set('views', path.join(__dirname, 'views'));

//database models

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

server.use(session({
  name: 'User Session',
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
  cookie: {
          maxAge: 1000 * 60 * 60 * 24 * 7   //Cookie Time
}
}))

//Paths

server.get('/', urlencoder,function(req, resp){
    if(req.session.username !== undefined){
        console.log("Test:" + req.session.username);
        const searchQuery = { username: req.body.username};
        userModel.findOne(searchQuery, function (err, foundUser){
            if(err) return console.error(err);
            if(foundUser != undefined && foundUser.username != null){
                req.session.username = foundUser.username;
                resp.render('./pages/main-postLogin',{username: req.session.username,image: foundUser.image});
            }
        });
    }              
    else{
        resp.render('./pages/main-page');
  }
});

server.get('/main-page', urlencoder,function(req, resp){
   resp.render('./pages/main-page');
});

server.get('/main-postLogin', urlencoder,function(req, resp){
   // resp.render('./pages/main-postLogin');
   		  const searchUser = { username: req.session.username};
          userModel.findOne(searchUser, function (err, foundUser) {
          	 console.log("Object: " + foundUser);
              resp.render('./pages/main-postLogin',{username: req.session.username,image: foundUser.image});
        });
});

server.get('/logout', function(req, resp){
    req.session.destroy();
    resp.redirect('/main-page');
    });

server.post('/main-postLogin', urlencoder,function(req, resp){    
    if(req.session.username !== undefined){
        console.log("Test:" + req.session.username);
        userModel.findOne(req.session.username, function (err, foundUser) {
              resp.render('./pages/main-postLogin',{username: req.session.username,image: foundUser.image});
        });
  }
    else{
    console.log(req.session.username);
    const searchQuery = { username: req.body.username};
    var passcheck = req.body.password;
    var hashedcheck = crypto.createHash("md5").update(passcheck).digest("hex");
    console.log("Input: " + hashedcheck);
    userModel.findOne(searchQuery, function (err, foundUser) {
      if(err) return console.error(err);
        console.log(foundUser);
      if(foundUser != undefined && foundUser.username != null){
           console.log("DB: " + foundUser.password);
          if(hashedcheck === foundUser.password){
              req.session.username = foundUser.username;
              resp.render('./pages/main-postLogin',{username: req.session.username,image: foundUser.image});
          }
      }else
        resp.render('./pages/main-page');
    });
  } 
});

server.get('/sign-up', function(req, resp){
   resp.render('./pages/sign-up');
});

server.post('/main-page', function(req, resp){
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var hashedpassword = crypto.createHash("md5").update(fields.password).digest("hex");
      var oldpath = files.image.path;
      var newpath = __dirname + '\\public\\new\\' + files.image.name;
      fs.rename(oldpath, newpath, function (err) {
        console.log('Saving files to new folder');
        if (err) throw err;
        addUser(fields.username, hashedpassword ,files.image.name, fields.email , fields.userBio ,function(){ 
          resp.render('./pages/main-page');
        });//adduser to DB
      });
    });
  });

server.get('/user-profile', urlencoder, function(req, resp){
    const searchUser = { username: req.session.username};
    userModel.findOne(searchUser, function (err, foundUser) {
         console.log("Object: " + foundUser);
//             viewUsers(function(list){
//            const data = { list:list };
            resp.render('./pages/user-profile',{username: req.session.username, image: foundUser.image, userBio: foundUser.userBio});//, data:data
//            });
    });
});

server.post('/user-profile', function(req, resp){
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var oldpath = files.memeimage.path;
      var newpath = __dirname + '\\public\\memes\\' + files.memeimage.name;
      fs.rename(oldpath, newpath, function (err) {
        console.log('Saving files to new folder');
        if (err) throw err;
        const searchUser = { username: req.session.username};
            userModel.findOne(searchUser, function (err, foundUser) {
            addMeme(fields.memeTitle,files.memeimage.name, fields.memeTag ,foundUser.username , fields.memePrivacy ,function(){ 
            console.log(fields.memeTitle);
            console.log(files.memeimage.name);
            console.log(fields.memeTag );
            console.log(foundUser.username );
            console.log(fields.memePrivacy);
            //console.log("Object: " + foundUser);
            var newmeme = new memeModel({
                memeTitle: fields.memeTitle,
                memeimage:files.memeimage.name,
                memeTag: fields.memeTag,
                memePrivacy: fields.memePrivacy
            })
            foundUser.meme.push(newmeme);
            foundUser.save(function (err, inv) {  //saves the user 
                if(err) return console.error(err);
                    callback();
            });
//            viewUsers(function(list){
//            const data = { list:list };
            resp.render('./pages/user-profile',{username: req.session.username, image: foundUser.image, userBio: foundUser.userBio});//, data:data
//            });
            });
        });//addmeme to DB
      });
    });
  });
//    viewUsers(function(list){
//      const data = { list:list };
//      resp.render('./pages/home',{ data:data });
//    });

server.get('/user-memes', function(req, resp){
    const searchMeme = { memeOwner: req.session.username};
    memeModel.findOne(searchMeme, function (err, foundMeme) {
    console.log("Object: " + foundMeme);
        resp.render('./pages/user-memes',{memeimage: foundMeme.memeimage});
        });
});

server.post('/upload-meme', urlencoder,function(req, resp){
    const searchMeme = { memeTitle: req.body.memeTitle};
    memeModel.deleteOne(searchMeme, function (err, foundMeme) {
//    userModel.deleteOne(searchMeme, function (err, userMeme){  //trying to delete the meme in the user schema          
//    });
//    const id = {_id};
//    memeModel.findOne(_id,funtion(err,foundId){});    
    console.log("Deleted Object: " + foundMeme);
    console.log("Deleted Object");
    resp.render('./pages/upload-meme');
    });
});

server.get('/about-page', function(req, resp){
   resp.render('./pages/about-page');
});

server.get('/about-pageSigned', function(req, resp){
   resp.render('./pages/about-pageSigned');
});

server.get('/meme-tags', function(req, resp){
   resp.render('./pages/meme-tags');
});

server.get('/meme-tagsDefault', function(req, resp){
   resp.render('./pages/meme-tagsDefault');
});

server.get('/upload-meme', function(req, resp){
   resp.render('./pages/upload-meme');
});

server.get('/view-meme', function(req, resp){
   resp.render('./pages/view-meme');
});

server.get('/view-meme2', function(req, resp){
   resp.render('./pages/view-meme2');
});

server.get('/view-meme3', function(req, resp){
   resp.render('./pages/view-meme3');
});

server.get('/view-meme4', function(req, resp){
   resp.render('./pages/view-meme4');
});

server.get('/view-meme5', function(req, resp){
   resp.render('./pages/view-meme5');
});

server.get('/view-meme6', function(req, resp){
   resp.render('./pages/view-meme6');
});

server.get('/view-meme7', function(req, resp){
   resp.render('./pages/view-meme7');
});

server.get('/view-meme8', function(req, resp){
   resp.render('./pages/view-meme8');
});

server.get('/view-meme9', function(req, resp){
   resp.render('./pages/view-meme9');
});

server.get('/view-meme10', function(req, resp){
   resp.render('./pages/view-meme10');
});

server.get('/view-meme11', function(req, resp){
   resp.render('./pages/view-meme11');
});

server.get('/view-meme12', function(req, resp){
   resp.render('./pages/view-meme12');
});

server.get('/view-meme13', function(req, resp){
   resp.render('./pages/view-meme13');
});

server.get('/view-meme14', function(req, resp){
   resp.render('./pages/view-meme14');
});

server.get('/view-meme15', function(req, resp){
   resp.render('./pages/view-meme15');
});

server.listen(PORT, () => console.log(`Listening on ${ PORT }`))

