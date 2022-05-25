'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const articleExist = require(`../middlewares/article-exist`);
const commentValidator = require(`../middlewares/comment-validator`);
const routeParamsValidator = require(`../middlewares/route-params-validator`);

const {asyncHandler} = require(`../../utils`);

module.exports = (app, articleService, commentService) => {
  const route = new Router();

  app.use(`/articles`, route);

  route.get(`/:articleId/comments`,
      [routeParamsValidator, articleExist(articleService)],
      asyncHandler(async (req, res) => {
        const {articleId} = req.params;
        const comments = await commentService.findAll(articleId);

        res.status(HttpCode.OK)
          .json(comments);

      }));

  route.post(`/:articleId/comments`,
      [routeParamsValidator, articleExist(articleService), commentValidator],
      asyncHandler(async (req, res) => {
        const {articleId} = req.params;
        const {limit} = req.query;
        const comment = await commentService.create(articleId, req.body);

        const [newComment, hotArticles] = await Promise.all([
          commentService.findComments({id: comment.id}),
          articleService.findHotArticles(limit)
        ]);

        return res.status(HttpCode.CREATED)
          .json({
            newComment,
            hotArticles
          });
      }));

  route.delete(`/:articleId/comments/:commentId`,
      [routeParamsValidator, articleExist(articleService)],
      asyncHandler(async (req, res) => {
        const {commentId} = req.params;
        const {limitComment, limitAnnounce} = req.query;
        const deleted = await commentService.drop(commentId);

        if (!deleted) {
          return res.status(HttpCode.NOT_FOUND)
            .send(`Not found`);
        }

        const [lastComments, hotArticles] = await Promise.all([
          commentService.findComments({limit: limitComment}),
          articleService.findHotArticles(limitAnnounce)
        ]);

        return res.status(HttpCode.OK)
          .json({
            lastComments,
            hotArticles
          });
      }));
};
