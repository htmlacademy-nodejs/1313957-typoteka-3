'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const {ensureArray} = require(`../../utils`);
const upload = require(`../../service/middlewares/multer-upload`);

const articlesRouter = new Router();

articlesRouter.get(`/category/:id`, (req, res) => res.render(`articles/articles-by-category`));

articlesRouter.get(`/add`, async (req, res) => {
  try {
    const categories = await api.getCategories();
    res.render(`articles/post-new`, {categories});
  } catch (error) {
    res.render(`errors/400`);
  }
});

articlesRouter.post(`/add`, upload.single(`upload`), async (req, res) => {
  const {body, file} = req;
  const articleData = {
    title: body.title,
    picture: file ? file.filename : ``,
    createdDate: body.date,
    announce: body.announcement,
    fullText: body[`full-text`],
    category: ensureArray(body.category),
  };

  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (error) {
    res.redirect(`back`);
  }
});

articlesRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  try {
    const [article, categories] = await Promise.all([
      await api.getArticle(id),
      await api.getCategories()
    ]);

    res.render(`articles/post-edit`, {article, categories});
  } catch (error) {
    res.render(`errors/400`);
  }
});

articlesRouter.get(`/:id`, (req, res) => res.render(`articles/post`));

module.exports = articlesRouter;
