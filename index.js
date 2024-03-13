const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8000;

const ConnectDb = require('./public/config/db.js');
const URL = require('./public/models/index.js');
const {
  restrictToLoggedinUserOnly,
  checkAuth,
} = require('./public/middlewares/middle.js');

const staticRoute = require('./public/routes/staticRoute.js');
const urlRoute = require('./public/routes/urlroutes.js');
const userRoutes = require('./public/routes/userroutes.js');

dotenv.config();
ConnectDb();

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false })); //for form data html
app.use(cookieParser());

app.use('/url', restrictToLoggedinUserOnly, urlRoute);
app.use('/user', userRoutes);
app.use('/', checkAuth, staticRoute);

app.set('view engine', 'ejs');
app.set('views', path.resolve('./public/views'));

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
