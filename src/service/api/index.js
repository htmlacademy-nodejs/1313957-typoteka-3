'use strict';

const {Router} = require(`express`);
const category = require(`../api/category`);
const search = require(`../api/search`);
const article = require(`../api/article`);
const comment = require(`../api/comment`);
const getMockData = require(`../lib/get-mock-data`);

const router = new Router();

const getRouter = async () => {
  const {
    CategoryService,
    SearchService,
    ArticleService,
    CommentService
  } = require(`../data-service`);

  const mockData = await getMockData();

  category(router, new CategoryService(mockData));
  search(router, new SearchService(mockData));
  article(router, new ArticleService(mockData));
  comment(router, new ArticleService(mockData), new CommentService());

  return router;
};

module.exports = getRouter;
