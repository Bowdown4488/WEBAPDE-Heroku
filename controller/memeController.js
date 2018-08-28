const memeModel = require('../model/memeModel');
const userModel = require('../model/userModel');
const formidable = require('formidable');
const bodyparser = require('body-parser')
const path = require('path')
const fs = require('fs');//used for file upload
const expressSanitizer = require('express-sanitizer');
const cool = require("cool-ascii-faces");

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
                
            var array = fields.memeShared.split(" ");
//            var user = req.session.username;
//            array.push(user);//push the user to the list so that he can see his memes
            console.log("Shared to: "+ array);
 
            var cleanShared = req.sanitize(array);
                
            memeModel.addMeme(cleanTitle, cleanImage, cleanTag ,foundUser.username , cleanPrivacy , cleanShared, function(){ 
            console.log("Pushed Meme");
            console.log(cleanTitle);
            console.log(cleanImage);
            console.log(cleanTag );
            console.log(foundUser.username );
            console.log(cleanPrivacy);
            console.log(cleanShared);
            //console.log("Object: " + foundUser);
            var newmeme = {
                memeTitle: cleanTitle,
                memeimage: cleanImage,
                memeTag: cleanTag,
                memePrivacy: cleanPrivacy,
                memeShared: cleanShared
            }
            foundUser.meme.push(newmeme);
            foundUser.save().then((foundUser)=>
            {
                resp.render('./pages/user-profile',{username: req.session.username, image: foundUser.image, userBio: foundUser.userBio});
            })
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
    
server.post('/edit-meme', function(req,resp){
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var oldpath = files.memeimage.path;
        var newpath = path.join('./','public','memes',files.memeimage.name);
        fs.rename(oldpath, newpath, function (err) {
            var array = fields.memeShared.split(" ");
//          var user = req.session.username;
//          array.push(user);//push the user to the list so that he can see his memes
            console.log("Shared to: "+ array);
            console.log("Start Edit");
            memeModel.editMeme(fields.oldTitle, fields.memeTitle, fields.memeTag, files.memeimage.name, fields.memePrivacy, array);
            userModel.editUserMeme(req.session.username, fields.memeID, fields.memeTitle, fields.memeTag, files.memeimage.name, fields.memePrivacy, array);
                console.log("Edit Finish");
                var findProfile = userModel.findOne(req.session.username);
                findProfile.then((foundUser)=>
                {
                    console.log("Object: " + foundUser);
                    resp.render('./pages/user-profile',{username: req.session.username, image: foundUser.image, userBio: foundUser.userBio});//, 
                })
            });
        })
    });
    
server.get('/meme-tagsDefault', function(req, resp){
        console.log("Tag Search fields: " + req.query.memeTag);
        var find = req.query.memeTag;
        memeModel.searchMeme(find, function(list){
            const data = { list:list };
            console.log(data);
            resp.render('./pages/meme-tagsDefault',{data: data,tag: req.query.memeTag});
        })
});

server.get('/meme-tags', function(req, resp){
        console.log("Tag Search fields: " + req.query.memeTag);
        var find = req.query.memeTag;
        memeModel.searchMeme(find, function(list){
            const data = { list:list };
            console.log(data);
            resp.render('./pages/meme-tags',{data: data,tag: req.query.memeTag});
        })
});

server.post('/add-Comment',function(req,resp){
    if(req.session.usernamename !== null){
    var form = new formidable.IncomingForm();
      form.parse(req, function (err, fields, files) {
        let comment = {
            commentOwner: req.session.username,
            commentString: fields.commentString
        }
        memeModel.pushComment(fields.memeID,comment);
        
    var findMeme = memeModel.findMemes(fields.memeTitle);
    findMeme.then((foundMeme)=>
    {
        console.log("Meme Found: " + foundMeme.memeTitle);
        console.log("Comments: " + foundMeme.memeComment);
        resp.render('./pages/view-memeLoged',{memeID: foundMeme._id, memeTitle: foundMeme.memeTitle, memeimage: foundMeme.memeimage, memeTag: foundMeme.memeTag, memeOwner: foundMeme.memeOwner, memeLikes: foundMeme.memeLikes, memeComment: foundMeme.memeComment});
    })
    });    
    }   
});
    
server.get('/meme-tagsDefaultMeme/:tags', function(req, resp){
        console.log("Tag Search fields: " + req.params.tags);
        var find = req.params.tags;
        memeModel.searchMeme(find, function(list){
            const data = { list:list };
            console.log(data);
            resp.render('./pages/meme-tagsDefault',{data: data,tag: req.params.tags});
        })
});

server.get('/meme-tagsMeme/:tags', function(req, resp){
        console.log("Tag Search fields: " + req.params.tags);
        var find = req.params.tags;
        memeModel.searchMeme(find, function(list){
            const data = { list:list };
            console.log(data);
            resp.render('./pages/meme-tags',{data: data,tag: req.params.tags});
        })
});
    
server.get('/view-memeLoged/:title', function(req, resp){
    console.log("Title passed: " + req.params.title);
    var findMeme = memeModel.findMemes(req.params.title);
    findMeme.then((foundMeme)=>
    {
        console.log("Meme Found: " + foundMeme.memeTitle);
        resp.render('./pages/view-memeLoged',{memeID: foundMeme._id, memeTitle: foundMeme.memeTitle, memeimage: foundMeme.memeimage, memeTag: foundMeme.memeTag, memeOwner: foundMeme.memeOwner, memeLikes: foundMeme.memeLikes, memeComment: foundMeme.memeComment});
    })
});
    
server.get('/view-meme/:title', function(req, resp){
    console.log("Title passed: " + req.params.title);
    var findMeme = memeModel.findMemes(req.params.title);
    findMeme.then((foundMeme)=>
    {
        console.log("Meme Found: " + foundMeme.memeTitle);
        resp.render('./pages/view-meme',{memeID: foundMeme._id, memeTitle: foundMeme.memeTitle, memeimage: foundMeme.memeimage, memeTag: foundMeme.memeTag, memeOwner: foundMeme.memeOwner, memeLikes: foundMeme.memeLikes, memeComment: foundMeme.memeComment});
    })
});
    
server.get('/edit-meme/:title', function(req,resp){
    var title = req.params.title;
    var findTitle = memeModel.findMemes(title);
    findTitle.then((foundMeme)=>
    {
        resp.render('./pages/edit-meme',{memeID: foundMeme._id, memeTitle: foundMeme.memeTitle, memeimage: foundMeme.memeimage, memeTag: foundMeme.memeTag, memeShared: foundMeme.memeShared});
    })
}); 
    
server.get('/meme-likes/:title', function (req,resp){
    console.log("Title " + req.params.title);
    console.log("User " + req.session.username);
    memeModel.addLike(req.params.title,req.session.username);
    var findUser = userModel.findOne(req.session.username)
    findUser.then((foundUser)=>
     {
         var user = req.session.username;
         memeModel.viewPublicPrivate(user,function(list){
             const data = { list:list };
            resp.render('./pages/main-postLogin',{username: req.session.username,image: foundUser.image, faces: cool(),data: data}); 
         });
     }) 
});
    
}

module.exports.Activate = memeModule;