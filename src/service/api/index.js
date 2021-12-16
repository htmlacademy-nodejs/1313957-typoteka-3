'use strict';

const {Router} = require(`express`);
const category = require(`../api/category`);
const search = require(`../api/search`);
const article = require(`../api/article`);
const comment = require(`../api/comment`);

const {
  CategoryService,
  SearchService,
  ArticleService,
  CommentService
} = require(`../data-service`);

const sequelize = require(`../lib/sequelize`);
const defineModels = require(`../models`);

const router = new Router();

defineModels(sequelize);

const getRouter = async () => {

  category(router, new CategoryService(sequelize));
  search(router, new SearchService(sequelize));
  article(router, new ArticleService(sequelize));
  comment(router, new ArticleService(sequelize), new CommentService(sequelize));

  return router;
};

module.exports = getRouter;
