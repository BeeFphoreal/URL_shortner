require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const shortUrl = require('./shorturl');

// Basic Configuration for port an db
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});


//url shortner api
app.post('/api/shorturl', async (req, res) => {
  // set url input and regex into variables
const userInput = req.body.url;
console.log('recieved url', userInput)
const urlPattern = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
 // test url against regex
if (!urlPattern.test(userInput)) {
  console.log('error in regex match')
  return res.json({error: 'invalid url'})
}

try
{
// check to see if urls exist in database if so return as json
  const existingUrl = await shortUrl.findOne({ originalUrl : userInput});
  if (existingUrl) {
  console.log('short url exist', existingUrl);
  return  res.json({original_url : existingUrl.originalUrl, short_url : existingUrl.shortUrl});
  }else{
//create and save urls to db and return original and shortend url as json 
 const newUrl = await shortUrl.create({ originalUrl: req.body.url});
 console.log('new url created', newUrl)
 return res.json({original_url: newUrl.originalUrl, short_url: newUrl.shortUrl});
  }
}
catch(err) {
  console.log('error saving url', err)
  res.status(500).json({error: 'failed to save url'})
};
});

 //return original url when short url path entered
app.get('/api/shorturl/:shortUrl', async (req, res) => {
//search db return any errors if none redirect to original url
  const shortUrlParam = req.params.shortUrl

try {
  const foundUrl = await shortUrl.findOne({shortUrl: shortUrlParam})
    console.log('found url', foundUrl)
  if (!foundUrl) {
    console.log(err)
  return res.status(404).json({error: 'could not find url'})
  }

 res.redirect(foundUrl.originalUrl) 

 }catch(err) {
  console.log('error', err);
  res.status(500).json({error: 'server error'})
 }
});
 
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
})
