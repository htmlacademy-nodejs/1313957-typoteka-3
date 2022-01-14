'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const {ensureArray, prepareErrors} = require(`../../utils`);
const upload = require(`../middlewares/multer-upload`);

const articlesRouter = new Router();

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
  try {
    const categories = await getAddArticleData();
    res.render(`articles/post-new`, {categories});
  } catch (error) {
    res.render(`errors/400`);
  }
});

articlesRouter.post(`/add`, upload.single(`upload`), async (req, res) => {
  const {body, file} = req;
  const articleData = {
    title: body.title,
    picture: file ? file.filename : ``,
    createdDate: body.date,
    announce: body.announcement,
    fullText: body[`full-text`],
    category: ensureArray(body.category),
  };

  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const categories = await getAddArticleData();
    res.render(`articles/post-new`, {categories, validationMessages});
  }
});

articlesRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  try {
    const [article, categories] = await getEditArticleData(id);
    res.render(`articles/post-edit`, {id, article, categories});
  } catch (error) {
    res.render(`errors/400`);
  }
});

articlesRouter.post(`/edit/:id`, upload.single(`upload`), async (req, res) => {
  const {body, file} = req;
  const {id} = req.params;
  const articleData = {
    title: body.title,
    picture: file ? file.filename : body[`old-image`],
    createdDate: body.date,
    announce: body.announcement,
    fullText: body[`full-text`],
    category: ensureArray(body.category),
  };

  try {
    await api.editArticle(id, articleData);
    res.redirect(`/my`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const [article, categories] = await getEditArticleData(id);
    res.render(`articles/post-edit`, {id, article, categories, validationMessages});
  }
});

articlesRouter.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  const article = await getViewArticleData(id, true);
  res.render(`articles/post`, {article, id});
});

articlesRouter.post(`/:id/comments`, async (req, res) => {
  const {id} = req.params;
  const {comment} = req.body;
  try {
    await api.createComment(id, {text: comment});
    res.redirect(`/article/${id}`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const offer = await getViewArticleData(id, true);
    res.render(`articles/post`, {offer, id, validationMessages});
  }
});

module.exports = articlesRouter;
