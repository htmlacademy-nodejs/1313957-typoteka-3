'use strict';

const {Router} = require(`express`);
const csrf = require(`csurf`);
const api = require(`../api`).getAPI();
const {prepareErrors, getArticleData} = require(`../../utils`);
const upload = require(`../middlewares/multer-upload`);
const auth = require(`../middlewares/auth`);
const verificationRole = require(`../middlewares/verification-role`);
const {DISPLAY_SETTINGS} = require(`../../constants`);

const articlesRouter = new Router();

const csrfProtection = csrf();

const getEditArticleData = async (articleId) => {
  const [article, categories] = await Promise.all([
    api.getArticle(articleId),
    api.getCategories()
  ]);
  return [article, categories];
};

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
  const articleData = getArticleData(req);

  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const categories = await api.getCategories();
    res.render(`articles/post-new`, {user, categories, validationMessages, articleData, csrfToken: req.csrfToken()});
  }
});

articlesRouter.get(`/:id`, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;

  const referer = req.get(`Referrer`) || `/`;
  const back = referer.includes(`category`) ? referer : `/`;

  try {
    const [article, categories] = await Promise.all([
      api.getArticle(id),
      api.getCategories({withCount: true})
    ]);

    const categoriesId = article.categories.map((item) => item.id);
    const categoriesArticle = categories.filter((item) => categoriesId.includes(item.id) === true);

    res.render(`articles/post`, {user, article, categoriesArticle, id, csrfToken: req.csrfToken(), back});
  } catch (error) {
    res.render(`errors/400`);
  }
});

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
    api.getCategories({withCount: true}),
    api.getCategory({id}),
  ]);

  if (!currentCategory) {
    return res.redirect(`/`);
  }

  const totalPages = Math.ceil(count / limitArticles);

  return res.render(`articles/articles-by-category`, {articles, categories, currentCategory, page, totalPages, user});
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
  const {id} = req.params;
  const articleData = getArticleData(req);

  try {
    await api.editArticle(id, articleData);
    res.redirect(`/my`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const [article, categories] = await getEditArticleData(id);
    res.render(`articles/post-edit`, {user, id, article, categories, validationMessages, csrfToken: req.csrfToken()});
  }
});

articlesRouter.post(`/:id/comments`, auth, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const {text} = req.body;

  try {
    const comment = await api.createComment(id, {userId: user.id, text});
    res.redirect(`/articles/${id}#${comment.id}`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const [article, categories] = await Promise.all([
      api.getArticle(id),
      api.getCategories({withCount: true})
    ]);

    const categoriesId = article.categories.map((item) => item.id);
    const categoriesArticle = categories.filter((item) => categoriesId.includes(item.id) === true);

    res.render(`articles/post`, {user, article, categoriesArticle, id, validationMessages, text, csrfToken: req.csrfToken()});
  }
});

articlesRouter.get(`/delete/:id`, auth, csrfProtection, async (req, res) => {
  const {id} = req.params;

  try {
    await api.deleteArticle(id);
    return res.redirect(`/my`);
  } catch (errors) {
    return res.redirect(`/my`);
  }
});

articlesRouter.get(`/:id/comments/delete/:commentId`, auth, csrfProtection, async (req, res) => {
  const {id: articleId, commentId} = req.params;

  try {
    await api.deleteComment({articleId, commentId});
    return res.redirect(`/my/comments`);
  } catch (errors) {
    return res.redirect(`/my/comments`);
  }
});

module.exports = articlesRouter;
