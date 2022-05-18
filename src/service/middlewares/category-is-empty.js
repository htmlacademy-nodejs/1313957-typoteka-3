'use strict';
const {HttpCode} = require(`../../constants`);

module.exports = (categoryService) => async (req, res, next) => {
  const {id} = req.params;
  const {name} = req.body;

  const categoriesWithArticles = await categoryService.getArticlesByCategory(id);

  if (categoriesWithArticles.length !== 0) {
    return res.status(HttpCode.BAD_REQUEST).send(`Категория "${name}" не удалена, имеет публикации`);
  }

  return next();
};
