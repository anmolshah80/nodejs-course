const express = require('express');
const path = require('path');

const URL = require('./models/url');

const { connectToMongoDB } = require('./connect');

const urlRoute = require('./routes/url');

const app = express();

const PORT = process.env.PORT || 8001;

connectToMongoDB('mongodb://127.0.0.1:27017/short-url')
  .then(() => console.log('MongoDb connected!'))
  .catch((err) => console.log('MongoDb connection error: ', err));

app.set('view engine', 'ejs');

app.set('views', path.resolve('./views'));

// app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/url', urlRoute);

app.get('/url/:shortId', async (req, res) => {
  const { shortId } = req.params;

  if (!shortId)
    return res
      .status(400)
      .json({ error: 'a valid shortId needs to be provided' });

  const entry = await URL.findOneAndUpdate(
    { shortId },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    },
  );

  res.redirect(entry.redirectURL);
});

app.get('/test', async (req, res) => {
  const allUrls = await URL.find({});

  return res.render('home', {
    urls: allUrls,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
