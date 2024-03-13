const shortId = require('shortid');

const URL = require('../models/index.js');

const handleGenerateNewShortUrl = async (req, res) => {
  const body = req.body;

  if (!body.url) return res.status(400).json({ error: 'url is Required' });

  const ShortId = shortId();
  await URL.create({
    ShortId: ShortId,
    redirectURL: body.url,
    visitHistory: [],
    createdBy: req.user._id,
  });
  return res.render('home', {
    id: ShortId,
  });
};

async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId;
  const result = await URL.findOne({ ShortId: shortId });
  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
}

module.exports = {
  handleGenerateNewShortUrl,
  handleGetAnalytics,
};
