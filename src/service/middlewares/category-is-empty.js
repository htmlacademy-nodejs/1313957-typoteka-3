'use strict';
const {HttpCode} = require(`../../constants`);

module.exports = (categoryService) => async (req, res, next) => {
  const {id} = req.params;

  const categoriesWithArticles = await categoryService.getArticlesByCategory(id);

  if (categoriesWithArticles.length !== 0) {
    return res.status(HttpCode.BAD_REQUEST).send(`Категория "${id}" не удалена, имеет публикации`);
  }

  return next();
};
