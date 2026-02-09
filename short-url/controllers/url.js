const { nanoid } = require("nanoid");

const URL = require("../models/url");
const { UrlSchema } = require("../lib/schema");

const { SHORT_ID_MAX_LENGTH } = require("../lib/constants");

async function handleGenerateNewShortURL(req, res, next) {
  const body = req.body;

  if (!req.user) return res.redirect("/login");

  const urls = await URL.find({ createdBy: req.user._id });

  if (!body.url) {
    // send a custom error in the same format as zod
    return res.status(400).render("home", {
      zodErrors: [
        {
          code: "custom",
          path: ["url"],
          message: "URL field cannot be empty",
        },
      ],
      urls,
    });
  }

  try {
    UrlSchema.parse({ url: body.url });

    const shortID = nanoid(SHORT_ID_MAX_LENGTH);

    await URL.create({
      shortId: shortID,
      redirectURL: body.url,
      visitHistory: [],
      createdBy: req.user._id,
    });

    // return res.status(201).json({ status: 'success', shortId: shortID });

    return res.status(201).render("home", {
      shortID,
      urls,
    });
  } catch (error) {
    return res.status(400).render("home", {
      zodErrors: JSON.parse(error),
      urls,
    });
  }
}

async function handleGetAnalytics(req, res, next) {
  const { shortId } = req.params;

  const result = await URL.findOne({ shortId });

  return res.json({
    status: "success",
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
}

module.exports = {
  handleGenerateNewShortURL,
  handleGetAnalytics,
};
