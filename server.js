const express = require('express')
const bodyParser= require('body-parser')
const app = express()
const multer = require('multer');
fs = require('fs-extra')
const {rows,row} = require('./pg');
var CryptoJS = require("crypto-js");
app.use(express.urlencoded({extended: true}))

// const MongoClient = require('mongodb').MongoClient
// ObjectId = require('mongodb').ObjectId

// const myurl = 'mongodb://localhost:27017';


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})

var upload = multer({ storage: storage })

// MongoClient.connect(myurl, (err, client) => {
//   if (err) return console.log(err)
//   db = client.db('test') 
//   app.listen(3000, () => {
//     console.log('listening on 3000')
//   })
// })

app.get('/',function(req,res){
  res.sendFile(__dirname + '/index.html');

});

// upload single file

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


