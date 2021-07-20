'use strict';

const {Router} = require(`express`);
const articlesRouter = new Router();

articlesRouter.get(`/:id`, (reg, res)=>res.render(`articles/post`));
articlesRouter.get(`/add`, (reg, res)=>res.render(`articles/new-post`));
articlesRouter.get(`/category/:id`, (reg, res)=>res.render(`articles/articles-by-category`));

module.exports = articlesRouter;
