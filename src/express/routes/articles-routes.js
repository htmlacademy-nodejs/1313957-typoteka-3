'use strict';

const {Router} = require(`express`);
const articlesRouter = new Router();

articlesRouter.get(`/:id`, (reg, res)=>res.send(`/articles/:id`));
articlesRouter.get(`/add`, (reg, res)=>res.send(`/articles/add`));
articlesRouter.get(`/edit/:id`, (reg, res)=>res.send(`/articles/edit/:id`));
articlesRouter.get(`/category/:id`, (reg, res)=>res.send(`/articles/category/:id`));

module.exports = articlesRouter;
