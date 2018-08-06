const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000;
const bodyparser = require('body-parser')
const session = require("express-session")
const mongoose = require("mongoose") 
const cookieparser = require("cookie-parser")
const fs = require('file-system')//for files
const multer = require('multer') //for uploading files

mongoose.connect('mongodb://localhost:27017/memeDB', 
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

var user = mongoose.model('userInfo',{
	username : String,
	password : String,
	memes: [{
		memeID: String,
		memeTitle: String,
		memeTag: String,
		memeOwner: String,
		memeDate: String,
		commentNumber: Number
	}]
//    ,
//	memeComment: [{
//		commentID: String,
//		commentItself: String,
//		commentOwner: String,
//		commentDate: String,
//	}]
})

var meme = mongoose.model('memeInfo',{
	memeTitle: String,
	memeTag: String,
	memeOwner: String,
	memeDate: String,
	memeDateTime: Date,
    memePrivacy:String,
//    memeShared:[{
//        username:String
//    }],
	memeComment: Number
//    ,
//	memeComment: [{
//		memeID: String,
//		commentItself: String,
//		memeOwner: String,
//		commentDate: String,
//	}]
})

//Paths

server.get('/', urlencoder,function(req, resp){
   resp.render('./pages/main-page');
});

server.get('/main-page', urlencoder,function(req, resp){
   resp.render('./pages/main-page');
});

server.get('/sign-up', function(req, resp){
   resp.render('./pages/sign-up');
});

server.get('/user-profile', urlencoder, function(req, resp){
   resp.render('./pages/user-profile');
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

