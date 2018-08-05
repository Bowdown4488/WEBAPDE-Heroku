const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const server = express();

server.set('view engine', 'ejs');
server.use(express.static(__dirname + 'public'));
server.set('views', path.join(__dirname, 'views'));

server.get('/', function(req, resp){
   resp.render('./pages/main-page');
});

//  .get('/main-page.html', (req, res) => res.sendFile(path.join(__dirname,'main-page.html')))
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

