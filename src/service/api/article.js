'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const articleExist = require(`../middlewares/article-exist`);
const articleValidator = require(`../middlewares/article-validator`);
const routeParamsValidator = require(`../middlewares/route-params-validator`);

const {asyncHandler} = require(`../../utils`);

module.exports = (app, articleService, commentService) => {
  const route = new Router();

  app.use(`/articles`, route);

  route.get(`/`, asyncHandler(async (req, res) => {
    const {offset, limit, comments, categoryId} = req.query;
    let result;
    if (limit || offset) {
      result = await articleService.findPage({limit, offset, categoryId});
    } else {
      result = await articleService.findAll(comments);
    }
    res.status(HttpCode.OK).json(result);
  }));

  route.post(`/`, articleValidator, asyncHandler(async (req, res) => {

    const article = await articleService.create(req.body);

    return res.status(HttpCode.CREATED)
      .json(article);
  }));

  route.get(`/hot_articles`, asyncHandler(async (req, res) => {
    const {limit} = req.query;
    const articles = await articleService.findHotArticles(limit);

    if (!articles) {
      return res.send([]);
    }

    return res.status(HttpCode.OK).json(articles);
  }));

  route.get(`/last_comments`, asyncHandler(async (req, res) => {
    const {limit} = req.query;
    const comments = await commentService.findComments({limit});

    if (!comments) {
      return res.send([]);
    }

    return res.status(HttpCode.OK).json(comments);
  }));

  route.get(`/:articleId`,
      routeParamsValidator,
      async (req, res) => {
        const {articleId} = req.params;

        const article = await articleService.findOne(articleId);
        if (!article) {
          return res.status(HttpCode.NOT_FOUND)
            .send(`Not found with ${articleId}`);
        }

        return res.status(HttpCode.OK)
          .json(article);
      });

  route.post(`/`, articleValidator, asyncHandler(async (req, res) => {

    const article = await articleService.create(req.body);

    return res.status(HttpCode.CREATED)
      .json(article);
  }));

  route.put(`/:articleId`,
      [routeParamsValidator, articleValidator],
      asyncHandler(async (req, res) => {
        const {articleId} = req.params;
        const updateArticle = await articleService.update(articleId, req.body);

        if (!updateArticle) {
          return res.status(HttpCode.NOT_FOUND)
            .send(`Not found with ${articleId}`);
        }

        return res.status(HttpCode.OK)
          .send(`Updated`);
      }));

  route.delete(`/:articleId`,
      [routeParamsValidator, articleExist(articleService)],
      asyncHandler(async (req, res) => {
        const {articleId} = req.params;
        const article = await articleService.drop(articleId);

        if (!article) {
          return res.status(HttpCode.NOT_FOUND)
            .send(`Not found`);
        }

        return res.status(HttpCode.OK)
          .json(article);
      }));
};
