const { nanoid } = require('nanoid');

const URL = require('../models/url');

const { SHORT_ID_MAX_LENGTH } = require('../lib/constants');

async function handleGenerateNewShortURL(req, res, next) {
  const body = req.body;

  if (!body.url) {
    return res
      .status(400)
      .json({ status: 'failed', error: 'url field is required' });
  }

  const shortID = nanoid(SHORT_ID_MAX_LENGTH);

  await URL.create({
    shortId: shortID,
    redirectURL: body.url,
    visitHistory: [],
  });

  // return res.status(201).json({ status: 'success', shortId: shortID });

  return res.status(201).render('home', {
    shortID,
  });
}

async function handleGetAnalytics(req, res, next) {
  const { shortId } = req.params;

  const result = await URL.findOne({ shortId });

  return res.json({
    status: 'success',
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
}

module.exports = {
  handleGenerateNewShortURL,
  handleGetAnalytics,
};
