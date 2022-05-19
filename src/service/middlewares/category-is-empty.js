'use strict';
const {HttpCode} = require(`../../constants`);

module.exports = (categoryService) => async (req, res, next) => {
  const {id} = req.params;

  const [categoriesWithArticles, {name}] = await Promise.all([
    categoryService.getArticlesByCategory(id),
    categoryService.findOne(id)
  ]);

  if (categoriesWithArticles.length !== 0) {
    return res.status(HttpCode.BAD_REQUEST).send(`Категория "${name}" не удалена, имеет публикации`);
  }

  return next();
};
