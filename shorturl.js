const mongoose = require('mongoose');
const shortid = require('shortid');


mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log('MongoDB connection successful'))
    .catch((err) => console.error('MongoDB connection error:', err));
  
    const urlSchema = new mongoose.Schema({
      originalUrl:{
        type: String,
        required: true
      },
      shortUrl:{
    type: String,
    required: true,
    default: shortid.generate
      }    
   });

   module.exports = mongoose.model('shortUrl', urlSchema)
  