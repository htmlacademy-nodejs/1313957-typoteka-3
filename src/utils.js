'use strict';

module.exports.getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports.shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }

  return someArray;
};

module.exports.createRandomDate = () => {

  const moment = require(`moment`);
  let start = new Date();
  let end = new Date();

  end.setMonth(start.getMonth() - 3);
  const createdDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return moment(createdDate).format(`YYYY.MM.DD, hh:mm:ss`);
};

module.exports.ensureArray = (value) => Array.isArray(value) ? value : [value];

module.exports.prepareErrors = (errors) => {
  return errors.response.data.split(`\n`);
};
