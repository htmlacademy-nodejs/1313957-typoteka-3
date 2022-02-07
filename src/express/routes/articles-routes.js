'use strict';

const {Router} = require(`express`);
const csrf = require(`csurf`);
const api = require(`../api`).getAPI();
const {ensureArray, prepareErrors} = require(`../../utils`);
const upload = require(`../middlewares/multer-upload`);
const auth = require(`../middlewares/auth`);

const articlesRouter = new Router();

const csrfProtection = csrf();

const getAddArticleData = () => {
  return api.getCategories();
};

const getEditArticleData = async (articleId) => {
  const [article, categories] = await Promise.all([
    api.getArticle(articleId),
    api.getCategories()
  ]);
  return [article, categories];
};

const getViewArticleData = (articleId, comments) => {
  return api.getArticle(articleId, comments);
};

articlesRouter.get(`/category/:id`, (req, res) => res.render(`articles/articles-by-category`));

articlesRouter.get(`/add`, async (req, res) => {
  const {user} = req.session;
  try {
    const categories = await getAddArticleData();
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
    createdDate: body.date,
    announce: body.announcement,
    fullText: body[`full-text`],
    category: ensureArray(body.category),
    userId: user.id
  };

  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const categories = await getAddArticleData();
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
    picture: file ? file.filename : body[`old-image`],
    createdDate: body.date,
    announce: body.announcement,
    fullText: body[`full-text`],
    category: ensureArray(body.category),
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
  const article = await getViewArticleData(id, true);
  res.render(`articles/post`, {user, article, id, csrfToken: req.csrfToken()});
});

articlesRouter.post(`/:id/comments`, auth, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const {comment} = req.body;
  try {
    await api.createComment(id, {userId: user.id, text: comment});
    res.redirect(`/article/${id}`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const offer = await getViewArticleData(id, true);
    res.render(`articles/post`, {user, offer, id, validationMessages, csrfToken: req.csrfToken()});
  }
});

module.exports = articlesRouter;
