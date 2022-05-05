'use strict';

const {Router} = require(`express`);
const verificationRole = require(`../middlewares/verification-role`);
const api = require(`../api`).getAPI();
const {prepareErrors} = require(`../../utils`);

const myRouter = new Router();

myRouter.get(`/`, verificationRole, async (req, res) => {
  const {user} = req.session;
  const articles = await api.getArticles();
  res.render(`articles/my-articles`, {user, articles});
});

myRouter.get(`/comments`, verificationRole, async (req, res) => {
  const {user} = req.session;
  const articles = await api.getArticles({comments: true});
  const comments = articles.flatMap((article) => article.comments);
  res.render(`comments`, {user, articles, comments});
});

myRouter.get(`/categories`, verificationRole, async (req, res) => {
  const {user} = req.session;
  const categories = await api.getCategories({count: true});
  res.render(`all-categories`, {user, categories});
});

myRouter.post(`/categories/add`, verificationRole, async (req, res) => {
  const {name} = req.body;

  try {
    await api.createCategory(name);
    return res.redirect(`/my/categories`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const categories = await api.getCategories();
    return res.render(`all-categories`, {categories, validationMessages});
  }
});

myRouter.post(`/categories/update/:id`, verificationRole, async (req, res) => {
  const {id} = req.params;
  const {name} = req.body;
  const categories = await api.getCategories();

  try {
    await api.updateCategory(id, name);
    return res.redirect(`/my/categories`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    return res.render(`all-categories`, {
      categories,
      validationMessages,
    });
  }
});

myRouter.post(`/categories/delete/:id`, verificationRole, async (req, res) => {
  const {id} = req.params;
  const categories = await api.getCategories();

  try {
    await api.deleteCategory(id);
    return res.redirect(`/my/categories`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    return res.render(`admin/all-categories`, {
      categories,
      validationMessages,
    });
  }
});

module.exports = myRouter;
