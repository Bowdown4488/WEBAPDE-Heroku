const memeModel = require('../model/memeModel');
const userModel = require('../model/userModel');
const formidable = require('formidable');
const bodyparser = require('body-parser')
const path = require('path')
const fs = require('fs');//used for file upload
const expressSanitizer = require('express-sanitizer');

function memeModule(server){
server.use(expressSanitizer());

const urlencoder = bodyparser.urlencoded({
    extended: false
});
    
server.get('/upload-meme', function(req, resp){
   resp.render('./pages/upload-meme');
});
    
server.get('/user-memes', function(req, resp){
    var findMeme = memeModel.findOwner(req.session.username);
    findMeme.then((foundMeme)=>
    {  
        if(foundMeme !== null){
              console.log("Found MEME:" + foundMeme);
//            var findMyMeme = memeModel.viewMyMeme(foundMeme.memeOwner);
//            findMyMeme.then((foundMyMeme)=>{
//            const data = {foundMyMeme: foundMyMeme};      
//            resp.render('./pages/user-memes',{data: data});
//        })   
                var find = foundMeme.memeOwner;
                console.log(find)
                memeModel.viewMyMeme(find, function(list){
                  const data = { list:list };
                  console.log(data);
                  console.log("User MEME found: " + data);
                  resp.render('./pages/user-memes',{data: data});
                })

        }
        else{
            resp.render('./pages/upload-meme');
        }
    })
});

     
server.post('/user-profile', function(req, resp){
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var oldpath = files.memeimage.path;
      var newpath = path.join('./','public','memes',files.memeimage.name);
      fs.rename(oldpath, newpath, function (err) {
        console.log('Saving files to new folder');
        if (err) throw err;
            var findUser = userModel.findOne(req.session.username)
            findUser.then((foundUser)=> {
            var cleanTitle = req.sanitize(fields.memeTitle);
            var cleanImage = req.sanitize(files.memeimage.name);
            var cleanTag = req.sanitize(fields.memeTag);
            var cleanPrivacy = req.sanitize(fields.memePrivacy);
            memeModel.addMeme(cleanTitle, cleanImage, cleanTag ,foundUser.username , cleanPrivacy ,function(){ 
            console.log("Pushed Meme");
            console.log(cleanTitle);
            console.log(cleanImage);
            console.log(cleanTag );
            console.log(foundUser.username );
            console.log(cleanPrivacy);
            //console.log("Object: " + foundUser);
            var newmeme = {
                memeTitle: cleanTitle,
                memeimage: cleanImage,
                memeTag: cleanTag,
                memePrivacy: cleanPrivacy
            }
            foundUser.meme.push(newmeme);
            foundUser.save().then((foundUser)=>
            {
                resp.render('./pages/user-profile',{username: req.session.username, image: foundUser.image, userBio: foundUser.userBio});
            })
//            viewUsers(function(list){
//            const data = { list:list };
            
            //, data:data
//            });
            });
        })//addmeme to DB
      });
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
    
server.get('/view-meme',urlencoder, function(req, resp){
    console.log("Title: " + req.body.memeTitle)
    var findMeme = memeModel.findOwner(req.body.memeTitle);
    findMeme.then((foundMeme)=>
    {
        console.log("Meme Found: " + foundMeme);
        resp.render('./pages/view-meme',{memeTitle: foundMeme.memeTitle, memeImage: foundMeme.memeImage, memeTag: foundMeme.memeTag, memeOwner: foundMeme.memeOwner});
    })
   
});

server.post('/meme-tagsDefault', function(req, resp){
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields){
        console.log("Tag Search fields: " + fields.memeTag);
        var find = fields.memeTag;
        memeModel.searchMeme(find, function(list){
            const data = { list:list };
            console.log(data);
            resp.render('./pages/meme-tagsDefault',{data: data,tag: fields.memeTag});
        })
    });
});
    
}
    
module.exports.Activate = memeModule;