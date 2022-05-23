'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const verificationRole = require(`../middlewares/verification-role`);
const {prepareErrors, asyncHandler} = require(`../../utils`);

const myRouter = new Router();

myRouter.get(`/`, verificationRole, asyncHandler(async (req, res) => {
  const {user} = req.session;
  const articles = await api.getArticles();
  res.render(`articles/my-articles`, {user, articles});
}));

myRouter.get(`/comments`, verificationRole, asyncHandler(async (req, res) => {
  const {user} = req.session;
  const articles = await api.getArticles({comments: true});
  const comments = articles.flatMap((article) => article.comments).sort(
      (a, b) => {
        let dateA = new Date(a.createdAt);
        let dateB = new Date(b.createdAt);
        return dateB - dateA;
      }
  );
  res.render(`comments`, {user, articles, comments});
}));

myRouter.get(`/categories`, verificationRole, asyncHandler(async (req, res) => {
  const {user} = req.session;
  const categories = await api.getCategories();
  res.render(`all-categories`, {user, categories});
}));

myRouter.post(`/categories/add`, verificationRole, asyncHandler(async (req, res) => {
  const {name} = req.body;

  try {
    await api.createCategory(name);
    return res.redirect(`/my/categories`);
  } catch (errors) {
    const {user} = req.session;
    const validationMessages = prepareErrors(errors);
    const categories = await api.getCategories();

    return res.render(`all-categories`, {user, categories, validationMessages});
  }
}));

myRouter.post(`/categories/update/:id`, verificationRole, asyncHandler(async (req, res) => {
  const {id} = req.params;
  const {name} = req.body;

  try {
    await api.updateCategory(id, name);
    return res.redirect(`/my/categories`);
  } catch (errors) {
    const {user} = req.session;
    const categories = await api.getCategories();
    const validationMessages = prepareErrors(errors);

    return res.render(`all-categories`, {user, categories, validationMessages});
  }
}));

myRouter.get(`/categories/delete/:id`, verificationRole, asyncHandler(async (req, res) => {
  const {id} = req.params;

  try {
    await api.deleteCategory(id);
    return res.redirect(`/my/categories`);
  } catch (errors) {
    const {user} = req.session;
    const categories = await api.getCategories();
    const validationMessages = prepareErrors(errors);

    return res.render(`all-categories`, {user, categories, validationMessages});
  }
}));

module.exports = myRouter;
