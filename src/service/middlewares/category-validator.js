'use strict';

const {HttpCode, CATEGORY_NAME} = require(`../../constants`);
const Joi = require(`joi`);
const {minSymbols, maxSymbols} = CATEGORY_NAME;

const ErrorCategoryMessage = {
  NAME_REQUIRED: `Название категории отсутствует`,
  NAME_MIN: `Длина наименования не может быть менее ${minSymbols} символов`,
  NAME_MAX: `Длина наименования не может быть более ${maxSymbols} символов`,
  CATEGORY_EXIST: `Добавляемая категория уже существует`,
};

const schema = Joi.object({
  name: Joi.string().min(minSymbols).max(maxSymbols).required().messages({
    'string.min': ErrorCategoryMessage.NAME_MIN,
    'string.max': ErrorCategoryMessage.NAME_MAX,
    'string.empty': ErrorCategoryMessage.NAME_REQUIRED,
  }),
});

module.exports = (categoryService) => async (req, res, next) => {
  const newCategory = req.body;

  const {error} = schema.validate(newCategory, {abortEarly: false});

  if (error) {
    return res
      .status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }

  const category = await categoryService.findByName(newCategory.name);

  if (category) {
    return res
      .status(HttpCode.BAD_REQUEST)
      .send(ErrorCategoryMessage.CATEGORY_EXIST);
  }

  return next();
};
