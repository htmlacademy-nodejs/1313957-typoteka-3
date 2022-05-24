'use strict';

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }

  return someArray;
};

const createRandomDate = () => {

  const dayjs = require(`dayjs`);
  let start = new Date();
  let end = new Date();

  end.setMonth(start.getMonth() - 3);
  const createdDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return dayjs(createdDate).format(`YYYY.MM.DD, hh:mm:ss`);
};

const prepareErrors = (errors) => {
  return errors.response.data.split(`\n`);
};

const collectCategories = (body) => {
  const result = [];

  for (let key in body) {
    if (body[key] === `on`) {
      const categoryId = Number(key.split(`-`)[1]);
      result.push(categoryId);
    }
  }

  return result;
};

const getArticleData = (req) => {
  const {body, file, session} = req;
  const {user} = session;

  const {
    title,
    announce,
    fullText,
    createdAt,
  } = body;

  const userId = user.id;
  const categories = collectCategories(body);
  const picture = file ? file.filename : (body.picture || ``);

  return {
    userId,
    title,
    announce,
    fullText,
    createdAt,
    categories,
    picture,
  };
};

const asyncHandler = (cb) => {
  return async function (req, res, next) {
    try {
      return await cb(req, res);
    } catch (err) {
      return next(err);
    }
  };
};

module.exports = {
  getRandomInt,
  shuffle,
  createRandomDate,
  prepareErrors,
  getArticleData,
  asyncHandler,
};
