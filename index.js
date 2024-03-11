const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const app = express();
const PORT = 8000;

const ConnectDb = require('./config/db');
const urlRoute = require('./routes/urlroutes');
const URL = require('./models/index.js');
const staticRoute = require('./routes/staticRoute.js');

dotenv.config();
ConnectDb();

app.use(express.static(path.join(__dirname, '')));
app.use(express.json());
app.use(express.urlencoded({ extended: false })); //for form data html

app.use('/url', urlRoute);
app.use('/', staticRoute);

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.get('/:shortId', async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      ShortId: shortId,
    },
    {
      $push: {
        visitHistory: { timestamp: Date.now() },
      },
    }
  );

  res.redirect(entry?.redirectURL);
});

app.listen(PORT, () => console.log(`Server is Started at ${PORT}`));
