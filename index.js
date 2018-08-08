const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000;
const bodyparser = require('body-parser')
const session = require("express-session")
const mongoose = require("mongoose") 
const cookieparser = require("cookie-parser")
const formidable = require('formidable'); 
const fs = require('fs');
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
//server.set('views', path.join(__dirname, 'views'));

//database models

const userSchema = mongoose.Schema({
	username : String,
	password : String,
    image: { type: String },
    email: String,
    userBio: String,
	meme: [{
		memeID: String,
		memeTitle: String,
		memeTag: [{
            tag:String
            }],
		memeOwner: String,
		memeDate: String,
        memeDateTime: Date,
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

//function viewUsers(callback){
//  userModel.find({}, function (err, list) {
//    if(err) return console.error(err);
//    callback(list);
//  });
//}

const memeSchema = mongoose.Schema({
    memeID: String,
	memeTitle: String,
	memeTag: [{
    tag:String
    }],
	memeOwner: String,
	memeDate: String,
	memeDateTime: Date,
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
   resp.render('./pages/main-postLogin');
});

server.get('/logout', function(req, resp){
    req.session.destroy();
    resp.redirect('/main-page');
    });

server.post('/main-postLogin', urlencoder,function(req, resp){
//    var findUser = userModel.findOne({
//    username: req.session.username},
//    )
//    req.session.username = req.body.username;
//    console.log(req.body.username);
    
    if(req.session.username !== undefined){
        console.log("Test:" + req.session.username);
        userModel.findOne(req.session.username, function (err, foundUser) {
              resp.render('./pages/main-postLogin',{username: req.session.username,image: foundUser.image});
        });
  }
    else{
    console.log(req.session.username);
    const searchQuery = { username: req.body.username, password: req.body.password };
    userModel.findOne(searchQuery, function (err, foundUser) {
      if(err) return console.error(err);
        console.log(foundUser);
      if(foundUser != undefined && foundUser.username != null){
        req.session.username = foundUser.username;
        resp.render('./pages/main-postLogin',{username: req.session.username,image: foundUser.image});
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
      var oldpath = files.image.path;
      var newpath = __dirname + '\\public\\new\\' + files.image.name;
      fs.rename(oldpath, newpath, function (err) {
        console.log('Saving files to new folder');
        if (err) throw err;
        addUser(fields.username, fields.password ,files.image.name, fields.email , fields.userBio ,function(){ 
          resp.render('./pages/main-page');
        });//adduser to DB
      });//rename
    });//parse
  });//post

server.get('/user-profile', urlencoder, function(req, resp){
    const searchUser = { username: req.session.username};
    userModel.findOne(searchUser, function (err, foundUser) {
         console.log("Object: " + foundUser);
        resp.render('./pages/user-profile',{username: req.session.username, image: foundUser.image, userBio: foundUser.userBio});
    });
});

server.get('/main-postLogin', function(req, resp){
   resp.render('./pages/main-postLogin');
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

