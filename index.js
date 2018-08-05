const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
const bodyparser = require('body-parser');

const server = express();

const urlencoder = bodyparser.urlencoded({
	extended: false
})

server.set('view engine', 'ejs');
server.use(express.static(__dirname + '/public'));
//server.set('views', path.join(__dirname, 'views'));

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

//  .get('/user-profile.html', (req, res) => res.sendFile(path.join(__dirname,'user-profile.html')))
//  .get('/sign-up.html', (req, res) => res.sendFile(path.join(__dirname,'sign-up.html')))
//  .get('/main-postLogin.html', (req, res) => res.sendFile(path.join(__dirname,'main-postLogin.html')))
//  .get('/about-page.html', (req, res) => res.sendFile(path.join(__dirname,'about-page.html')))
//  .get('/about-pageSigned.html', (req, res) => res.sendFile(path.join(__dirname,'about-pageSigned.html')))
//  .get('/meme-tags.html', (req, res) => res.sendFile(path.join(__dirname,'meme-tags.html')))
//  .get('/meme-tagsDefault.html', (req, res) => res.sendFile(path.join(__dirname,'meme-tagsDefault.html')))
//  .get('/upload-meme.html', (req, res) => res.sendFile(path.join(__dirname,'upload-meme.html')))
//  .get('/view-meme.html', (req, res) => res.sendFile(path.join(__dirname,'view-meme.html')))
//.get('/view-meme.html', (req, res) => res.sendFile(path.join(__dirname,'view-meme.html')))
//.get('/view-meme2.html', (req, res) => res.sendFile(path.join(__dirname,'view-meme2.html')))
//.get('/view-meme3.html', (req, res) => res.sendFile(path.join(__dirname,'view-meme3.html')))
//.get('/view-meme4.html', (req, res) => res.sendFile(path.join(__dirname,'view-meme4.html')))
//.get('/view-meme5.html', (req, res) => res.sendFile(path.join(__dirname,'view-meme5.html')))
//.get('/view-meme6.html', (req, res) => res.sendFile(path.join(__dirname,'view-meme6.html')))
//.get('/view-meme7.html', (req, res) => res.sendFile(path.join(__dirname,'view-meme7.html')))
//.get('/view-meme8.html', (req, res) => res.sendFile(path.join(__dirname,'view-meme8.html')))
//.get('/view-meme9.html', (req, res) => res.sendFile(path.join(__dirname,'view-meme9.html')))
//.get('/view-meme10.html', (req, res) => res.sendFile(path.join(__dirname,'view-meme10.html')))
//.get('/view-meme11.html', (req, res) => res.sendFile(path.join(__dirname,'view-meme11.html')))
//.get('/view-meme12.html', (req, res) => res.sendFile(path.join(__dirname,'view-meme12.html')))
//.get('/view-meme13.html', (req, res) => res.sendFile(path.join(__dirname,'view-meme13.html')))
//.get('/view-meme14.html', (req, res) => res.sendFile(path.join(__dirname,'view-meme14.html')))
//.get('/view-meme15.html', (req, res) => res.sendFile(path.join(__dirname,'view-meme15.html')))

  server.listen(PORT, () => console.log(`Listening on ${ PORT }`))

