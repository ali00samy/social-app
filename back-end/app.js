const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const feedRoute = require('./routes/feed');
const authRoute = require('./routes/auth');

const app = express();

const fileStorage = multer.diskStorage({
  destination: 'images',
  filename : (req,file,cb)=>{
      cb(null,file.originalname)
  }
})

const fileFilter = (req,file,cb) =>{
  if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
  ){
      cb(null,true)
  } else{
      cb(null,false)
  }
}

app.use(bodyParser.json());
app.use(multer({storage: fileStorage,fileFilter: fileFilter}).single('image'));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/feed',feedRoute);
app.use('/auth',authRoute);

app.use((error, req,res ,next) => {
    console.log(error);
    const status = error.statusCode;
    const message = error.message;
    const data = error.data;
    res.status(status).json({message: message, data: data});
});

mongoose.connect('mongodb+srv://Alisamy:151500@cluster0.ke6yw.mongodb.net/restApi?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {console.log('Connected to database')})
    .catch((err) => {console.log(err)});

// const server = app.listen( 333,()=>{
//     console.log('Server is running on port 333');
// })
// const io = require('socket.io')(server);

const server = app.listen(333);

const io = require('./socket').init(server);
 
io.on('connection', socket => {
    console.log('Client Connected'); 
});