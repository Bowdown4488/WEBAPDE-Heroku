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
const server = express();   

//const fs = require('file-system')//for files
//const multer = require('multer') //for uploading files

server.set('view engine', 'ejs');
server.use(express.static(__dirname + '/public'));
server.set('views', path.join(__dirname, 'views'));

const urlencoder = bodyparser.urlencoded({
    extended: false
});

const controllers = ['user','meme'];
for(var i=0;i<controllers.length;i++){
  const mdl = require('./controller/'+controllers[i]+'Controller');
  mdl.Activate(server);
}


//    viewUsers(function(list){
//      const data = { list:list };
//      resp.render('./pages/home',{ data:data });
//    });

//server.get('/view-meme4', function(req, resp){
//   resp.render('./pages/view-meme4');
//});
//
//server.get('/view-meme5', function(req, resp){
//   resp.render('./pages/view-meme5');
//});
//
//server.get('/view-meme6', function(req, resp){
//   resp.render('./pages/view-meme6');
//});
//
//server.get('/view-meme7', function(req, resp){
//   resp.render('./pages/view-meme7');
//});
//
//server.get('/view-meme8', function(req, resp){
//   resp.render('./pages/view-meme8');
//});
//
//server.get('/view-meme9', function(req, resp){
//   resp.render('./pages/view-meme9');
//});
//
//server.get('/view-meme10', function(req, resp){
//   resp.render('./pages/view-meme10');
//});
//
//server.get('/view-meme11', function(req, resp){
//   resp.render('./pages/view-meme11');
//});
//
//server.get('/view-meme12', function(req, resp){
//   resp.render('./pages/view-meme12');
//});
//
//server.get('/view-meme13', function(req, resp){
//   resp.render('./pages/view-meme13');
//});
//
//server.get('/view-meme14', function(req, resp){
//   resp.render('./pages/view-meme14');
//});
//
//server.get('/view-meme15', function(req, resp){
//   resp.render('./pages/view-meme15');
//});

server.listen(PORT, () => console.log(`Listening on ${ PORT }`))

