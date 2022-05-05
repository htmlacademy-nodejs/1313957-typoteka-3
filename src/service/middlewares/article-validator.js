'use strict';

const Joi = require(`joi`);
const {HttpCode} = require(`../../constants`);

const ErrorArticleMessage = {
  TITLE_MIN: `Заголовок содержит менее 30 символов.`,
  TITLE_MAX: `Заголовок не может содержать более 250 символов.`,
  PICTURE: `Тип изображения не поддерживается`,
  DATE: `Дата должна быть заполнена.`,
  CATEGORIES: `Не выбрана ни одна категория публикации.`,
  ANNOUNCE_MIN: `Анонс публикации содержит меньше 30 символов.`,
  ANNOUNCE_MAX: `Анонс публикации не может содержать более 250 символов.`,
  FULL_TEXT: `Полный текст публикации не может быть более 1000 символов.`,
  USER_ID: `Некорректный Id пользователя`,
};

const schema = Joi.object({
  title: Joi.string().min(30).max(250).required().messages({
    'string.min': ErrorArticleMessage.TITLE_MIN,
    'string.max': ErrorArticleMessage.TITLE_MAX
  }),
  picture: Joi.string().allow(``).messages({
    'picture.string': ErrorArticleMessage.PICTURE
  }),
  categories: Joi.array().items(
      Joi.number().integer().positive().messages({
        'number.base': ErrorArticleMessage.CATEGORIES
      })
  ).min(1).required(),
  announce: Joi.string().min(30).max(250).required().messages({
    'announce.min': ErrorArticleMessage.ANNOUNCE_MIN,
    'announce.max': ErrorArticleMessage.ANNOUNCE_MAX
  }),
  fullText: Joi.string().max(1000).required().messages({
    'fullText.max': ErrorArticleMessage.FULL_TEXT
  }),
  userId: Joi.number().integer().positive().required().messages({
    'number.base': ErrorArticleMessage.USER_ID,
  }),
});

module.exports = (req, res, next) => {
  const newArticle = req.body;
  const {error} = schema.validate(newArticle, {abortEarly: false});

  if (error) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }

  return next();
};
