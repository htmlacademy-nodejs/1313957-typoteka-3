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

module.exports = {
  getRandomInt,
  shuffle,
  createRandomDate,
  prepareErrors
};
