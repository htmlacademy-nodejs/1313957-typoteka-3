'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();

const mainRouter = new Router();

mainRouter.get(`/`, async (req, res) => {
  const articles = await api.getArticles();
  res.render(`main`, {articles});
});

mainRouter.get(`/login`, (req, res) => res.render(`login`));

mainRouter.get(`/search`, async (req, res) => {
  const {query} = req.query;
  try {
    const results = await api.search(query);

    res.render(`search-result`, {results, query});
  } catch (error) {
    res.render(`search-empty`, {query});
  }
});

mainRouter.get(`/register`, (req, res) => res.render(`sign-up`));

mainRouter.get(`/categories`, (req, res) => res.render(`all-categories`));

module.exports = mainRouter;
