'use strict';

const {HttpCode} = require(`../../constants`);

module.exports = (categoryService) => async (req, res, next) => {
  const {id} = req.params;

  const category = await categoryService.findOne(id);

  if (!category) {
    return res
      .status(HttpCode.NOT_FOUND)
      .send(`Категория c "${id}" не найдена`);
  }

  return next();
};
