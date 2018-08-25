const userModel = require('../model/userModel');
const memeModel = require('../model/memeModel');
const formidable = require('formidable');
const crypto = require("crypto");
const bodyparser = require('body-parser')
const session = require('express-session');
const cookieparser = require('cookie-parser');
const path = require('path')
const fs = require('fs');//used for file upload
const cool = require("cool-ascii-faces");
function userModule(server){
    
server.use(session({
  name: 'User Session',
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
  cookie: {
          maxAge: 1000 * 60 * 60 * 24 * 7   //Cookie Time
}
}))
    
const urlencoder = bodyparser.urlencoded({
    extended: false
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
    
server.get('/view-meme', function(req, resp){
   resp.render('./pages/view-meme');
});

server.get('/view-meme2', function(req, resp){
   resp.render('./pages/view-meme2');
});

server.get('/view-meme3', function(req, resp){
   resp.render('./pages/view-meme3');
});
    

server.get('/', urlencoder,function(req, resp){
    if(req.session.username !== undefined){
        console.log("Test:" + req.session.username);
        var findUser = userModel.findOne(req.session.username)
        findUser.then((foundUser)=>
        {
            if(err) return console.error(err);
            if(foundUser != undefined && foundUser.username != null){
                req.session.username = foundUser.username;
                resp.render('./pages/main-postLogin',{username: req.session.username,image: foundUser.image, faces: cool()});
            }
        })
    }       
    else{
    memeModel.viewMeme(function(list){
      const data = { list:list };
      resp.render('./pages/main-page',{data: data});
    });
  }
});

server.get('/main-page', urlencoder,function(req, resp){
       memeModel.viewMeme(function(list){
      const data = { list:list };
      resp.render('./pages/main-page',{data: data});
    });
});

server.get('/main-postLogin', urlencoder,function(req, resp){
        var findUser = userModel.findOne(req.session.username)
        findUser.then((foundUser)=>
        {
           resp.render('./pages/main-postLogin',{username: req.session.username,image: foundUser.image,faces: cool()}); 
        })   
});

server.get('/logout', function(req, resp){
    req.session.destroy();
    resp.redirect('/main-page');
    });

server.post('/main-postLogin', urlencoder,function(req, resp){    
    if(req.session.username !== undefined){
        console.log("Test:" + req.session.username);
        var findUser = userModel.findOne(req.session.username)
        findUser.then((foundUser)=>
        {
           resp.render('./pages/main-postLogin',{username: req.session.username,image: foundUser.image, faces: cool()}); 
        })       
    }
    else{
    console.log(req.session.username);
    var passcheck = req.body.password;
    var hashedcheck = crypto.createHash("md5").update(passcheck).digest("hex");
    console.log("Hash: " + hashedcheck);
    var findUser = userModel.findOne(req.body.username)
    findUser.then((foundUser)=>
    {
      console.log(foundUser);
      if(foundUser != undefined && foundUser.username != null){
           console.log("DB: " + foundUser.password);
          if(hashedcheck === foundUser.password){
              req.session.username = foundUser.username;
              resp.render('./pages/main-postLogin',{username: req.session.username,image: foundUser.image, faces: cool()});
          }
      }else
    memeModel.viewMeme(function(list){
      const data = { list:list };
      resp.render('./pages/main-page',{data: data});
    });
    })
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
      var newpath = path.join('./','public','new',files.image.name);
      fs.rename(oldpath, newpath, function (err) {
        console.log('Saving files to new folder');
        if (err) throw err;
        userModel.addUser(fields.username, hashedpassword ,files.image.name, fields.email , fields.userBio ,function(){ 
        memeModel.viewMeme(function(list){
            const data = { list:list };
            resp.render('./pages/main-page',{data: data});
        });
        });//adduser to DB
      });
    });
  });

server.get('/user-profile', function(req, resp){   
    var findProfile = userModel.findOne(req.session.username);
    findProfile.then((foundUser)=>
    {
//             viewUsers(function(list){
//            const data = { list:list };
        console.log("Object: " + foundUser);
        resp.render('./pages/user-profile',{username: req.session.username, image: foundUser.image, userBio: foundUser.userBio});//, 
//        data:data
//            });
    })
});
    
}
module.exports.Activate = userModule;