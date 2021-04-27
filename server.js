const express = require('express')
const app = express()
const multer = require('multer');
fs = require('fs-extra')
const {rows,row} = require('./pg');
var CryptoJS = require("crypto-js");
app.use(express.urlencoded({extended: true}))


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})

var upload = multer({ storage: storage })

app.get('/',function(req,res){
  res.sendFile(__dirname + '/index.html');

});

app.post('/uploadfile', upload.single('myFile'), async(req, res, next) => {
  const file = req.file
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)

  }
  var path = './' + file.path 
  var ciphertext = CryptoJS.AES.encrypt(path, 'secret key 123').toString();
 
console.log(ciphertext);
const fileU = await row('insert into files(file_path) values($1) returning *', ciphertext)
res.send(fileU)
 
})

app.get('/files', async(req,res)=> {
  try {
    const allFiles = await rows('select * from files')
   for (let i = 0; i < allFiles.length; i++) {
     const element = allFiles[i].file_path;
     var bytes  = CryptoJS.AES.decrypt(element, 'secret key 123');
     var originalFile = bytes.toString(CryptoJS.enc.Utf8);
    allFiles[i].file_path = originalFile
   }

    
    res.status(200).send(allFiles)
  } catch (error) {
    res.status(500).json({error:error.message})
  }
})


app.listen(3000)


