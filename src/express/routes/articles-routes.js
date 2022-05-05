'use strict';

const {Router} = require(`express`);
const csrf = require(`csurf`);
const api = require(`../api`).getAPI();
const {prepareErrors} = require(`../../utils`);
const upload = require(`../middlewares/multer-upload`);
const auth = require(`../middlewares/auth`);
const verificationRole = require(`../middlewares/verification-role`);
const {DISPLAY_SETTINGS} = require(`../../constants`);

const articlesRouter = new Router();

const csrfProtection = csrf();

const collectCategories = (formData) => {
  const keys = Object.keys(formData);
  return keys
    .filter((item) => /category/.test(item))
    .map((item) => Number(item.split(`-`).pop()));
};

const getEditArticleData = async (articleId) => {
  const [article, categories] = await Promise.all([
    api.getArticle(articleId),
    api.getCategories()
  ]);
  return [article, categories];
};

articlesRouter.get(`/category/:id`, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  let {page = 1} = req.query;
  page = +page;

  const {limitArticles} = DISPLAY_SETTINGS;
  const offset = (page - 1) * limitArticles;

  const [
    {count, articles},
    categories,
    currentCategory
  ] = await Promise.all([
    api.getArticles({offset, limit: limitArticles, categoryId: id}),
    api.getCategories({count: true}),
    api.getCategory({id}),
  ]);

  if (!currentCategory) {
    return res.redirect(`/`);
  }

  const totalPages = Math.ceil(count / limitArticles);

  return res.render(`articles/articles-by-category`, {articles, categories, currentCategory, page, totalPages, user});
});

articlesRouter.get(`/add`, verificationRole, csrfProtection, async (req, res) => {
  const {user} = req.session;

  try {
    const categories = await api.getCategories();
    res.render(`articles/post-new`, {user, categories, csrfToken: req.csrfToken()});
  } catch (error) {
    res.render(`errors/400`);
  }
});

articlesRouter.post(`/add`, auth, upload.single(`upload`), csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {body, file} = req;
  const articleData = {
    title: body.title,
    picture: file ? file.filename : ``,
    announce: body.announcement,
    fullText: body[`full-text`],
    categories: collectCategories(body),
    userId: user.id
  };

  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const categories = await api.getCategories();
    res.render(`articles/post-new`, {user, categories, validationMessages, csrfToken: req.csrfToken()});
  }
});

articlesRouter.get(`/edit/:id`, auth, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  try {
    const [article, categories] = await getEditArticleData(id);
    res.render(`articles/post-edit`, {user, id, article, categories, csrfToken: req.csrfToken()});
  } catch (error) {
    res.render(`errors/400`);
  }
});

articlesRouter.post(`/edit/:id`, auth, upload.single(`upload`), csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {body, file} = req;
  const {id} = req.params;
  const articleData = {
    title: body.title,
    picture: file ? file.filename : body.photo,
    announce: body.announce,
    fullText: body[`full-text`],
    categories: collectCategories(body),
    userId: user.id
  };

  try {
    await api.editArticle(id, articleData);
    res.redirect(`/my`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const [article, categories] = await getEditArticleData(id);
    res.render(`articles/post-edit`, {user, id, article, categories, validationMessages, csrfToken: req.csrfToken()});
  }
});

articlesRouter.get(`/:id`, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;

  const referer = req.get(`Referrer`);
  const back = referer || `/`;

  try {
    const article = await api.getArticle(id);

    res.render(`articles/post`, {user, article, id, csrfToken: req.csrfToken(), back});
  } catch (error) {
    res.render(`errors/400`);
  }
});

articlesRouter.post(`/:id/comments`, auth, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const {comment} = req.body;

  try {
    await api.createComment(id, {userId: user.id, text: comment});
    res.redirect(`/articles/${id}`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const article = await api.getArticle(id);
    res.render(`articles/post`, {user, article, id, validationMessages, comment, csrfToken: req.csrfToken()});
  }
});

articlesRouter.post(`/delete/:id`, auth, csrfProtection, async (req, res) => {
  const {id} = req.params;

  try {
    await api.deleteArticle(id);
    return res.redirect(`/my`);
  } catch (errors) {
    return res.redirect(`/my`);
  }
});

articlesRouter.post(`/:id/comments/delete/:commentId`, auth, csrfProtection, async (req, res) => {
  const {id: articleId, commentId} = req.params;

  try {
    await api.deleteComment({articleId, commentId});
    return res.redirect(`/my/comments`);
  } catch (errors) {
    return res.redirect(`/my/comments`);
  }
});

module.exports = articlesRouter;
