'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const {DISPLAY_SETTINGS} = require(`../../constants`);
const upload = require(`../middlewares/multer-upload`);
const {prepareErrors, asyncHandler} = require(`../../utils`);

const mainRouter = new Router();

mainRouter.get(`/`, asyncHandler(async (req, res) => {

  const {user} = req.session;

  let {page = 1} = req.query;
  page = +page;

  const {limitArticles, limitAnnounce, limitComment, maxAnnounceLength, maxCommentLength} = DISPLAY_SETTINGS;

  const offset = (page - 1) * limitArticles;
  const [
    {count, articles},
    categories,
    hotArticles,
    lastComments
  ] = await Promise.all([
    api.getArticles({offset, limit: limitArticles}),
    api.getCategories({withCount: true}),
    api.getHotArticles({limit: limitAnnounce}),
    api.getLastComments({limit: limitComment}),
  ]);
  const totalPages = Math.ceil(count / limitArticles);

  res.render(`main`, {articles, hotArticles, maxAnnounceLength, lastComments, maxCommentLength, categories, page, totalPages, user});
}));

mainRouter.get(`/register`, (req, res) => {
  const {user} = req.session;
  res.render(`sign-up`, {user});
});

mainRouter.post(`/register`, upload.single(`upload`), asyncHandler(async (req, res) => {
  const {body, file} = req;
  const userData = {
    avatar: file ? file.filename : ``,
    name: body[`name`],
    surname: body[`surname`],
    email: body[`email`],
    password: body[`password`],
    passwordRepeated: body[`repeat-password`],
    role: `reader`
  };
  try {
    await api.createUser(userData);
    res.redirect(`/login`);
  } catch (errors) {
    const {user} = req.session;
    const validationMessages = prepareErrors(errors);
    res.render(`sign-up`, {user, userData, validationMessages});
  }
}));

mainRouter.get(`/login`, (req, res) => {
  const {user} = req.session;
  res.render(`login`, {user});
});

mainRouter.post(`/login`, asyncHandler(async (req, res) => {
  try {
    const user = await api.auth(req.body[`email`], req.body[`password`]);
    req.session.user = user;
    req.session.save(() => {
      res.redirect(`/`);
    });
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const {user} = req.session;
    const {email} = req.body;
    res.render(`login`, {user, email, validationMessages});
  }
}));

mainRouter.get(`/logout`, (req, res) => {
  req.session.destroy(() => res.redirect(`/`));
});

mainRouter.get(`/search`, asyncHandler(async (req, res) => {
  const {user} = req.session;
  const {query} = req.query;

  if (!query) {
    return res.render(`search-result`, {
      results: [],
      query: ``,
    });
  }

  try {
    const results = await api.search(query);
    return res.render(`search-result`, {user, query, results});
  } catch (error) {
    return res.render(`search-empty`, {user, query, results: []});
  }
}));

module.exports = mainRouter;
