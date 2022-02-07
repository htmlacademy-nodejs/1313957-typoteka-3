'use strict';

const {Router} = require(`express`);
const verificationRole = require(`../middlewares/verification-role`);
const api = require(`../api`).getAPI();

const myRouter = new Router();

myRouter.get(`/`, verificationRole, async (req, res) => {
  const {user} = req.session;
  const articles = await api.getArticles();
  res.render(`articles/my-articles`, {user, articles});
});

myRouter.get(`/comments`, verificationRole, async (req, res) => {
  const {user} = req.session;
  const articles = await api.getArticles({comments: true});
  const comments = articles.map((article) => article.comments);
  res.render(`comments`, {user, articles, comments});
});

myRouter.get(`/categories`, async (req, res) => {
  const {user} = req.session;
  const categories = await api.getCategories(true);
  res.render(`all-categories`, {user, categories});
});

module.exports = myRouter;
