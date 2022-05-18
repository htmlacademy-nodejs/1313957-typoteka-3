'use strict';
const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const categoryValidator = require(`../middlewares/category-validator`);
const categoryExistence = require(`../middlewares/category-existance`);
const categoryIsEmpty = require(`../middlewares/category-is-empty`);

module.exports = (app, categoryService) => {
  const route = new Router();

  app.use(`/categories`, route);

  route.get(`/`, async (req, res) => {
    const {withCount} = req.query;
    const categories = await categoryService.findAll(withCount);
    res.status(HttpCode.OK)
      .json(categories);
  });

  route.get(`/:id`, async (req, res) => {
    const {id} = req.params;
    const category = await categoryService.findOne(id);
    return res.status(HttpCode.OK).json(category);
  });

  route.post(`/add`, categoryValidator(categoryService), async (req, res) => {
    const {name} = req.body;
    const category = await categoryService.create(name);
    return res.status(HttpCode.OK).json(category);
  });

  route.put(`/:id`, categoryExistence(categoryService), async (req, res) => {
    const {id} = req.params;
    const {name} = req.body;

    const isUpdated = await categoryService.update(id, name);

    if (!isUpdated) {
      return res
        .status(HttpCode.BAD_REQUEST)
        .send(`Категория "${name}" не была обновлена`);
    }

    return res
      .status(HttpCode.OK)
      .send(`Категория "${name}" была обновлена`);
  });

  route.delete(`/:id`, categoryExistence(categoryService), categoryIsEmpty(categoryService), async (req, res) => {
    const {id} = req.params;
    const isDeleted = await categoryService.drop(id);

    if (!isDeleted) {
      return res.sendStatus(HttpCode.NOT_FOUND);
    }

    return res.sendStatus(HttpCode.OK);
  },
  );
};
