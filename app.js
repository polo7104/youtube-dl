const express = require('express');
const app = express();
const port = 8080;
const bodyParser = require('body-parser');
const fs = require('fs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

const ytdl = require("youtube-dl.js");

app.post('/mp3/extract',(req,res)=>{
  var url = req.body.url;
  var filePrefix = req.body.name;
  var filename = `files/${filePrefix}.%(ext)s`;
  var args = ["-o", filename, "-x", "--audio-format=mp3", "--restrict-filenames", "--external-downloader=ffmpeg", "--audio-quality=96k"];
  if(url.search('&list=') > 0){
    url = url.substr(0,url.search('&list='));
  }
  ytdl(url, args)
  .then(data => {
    console.log(data);  
    res.download('files/'+filePrefix+'.mp3',filePrefix+'.mp3',function(err){
      if(err){
        console.log(err);
      }else{
        fs.unlink('files/'+filePrefix+'.mp3');
        res.redirect('/mp3/setfile');
      }
    });     
  })
  .catch(err => {
    console.error(err);
  });  
});
 
app.get('/mp3/setfile',(req,res)=>{
  fs.readFile('index.html', function (error, data) { // index.html 파일 로드 .
    if (error) {
      console.log(error);
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' }); // Head Type 설정 .
      res.end(data); // 로드 html response .
    } 
  });        
});

app.listen(port,()=>{
  console.log('app started');
}); 

