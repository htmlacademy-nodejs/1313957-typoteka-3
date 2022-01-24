'use strict';

const fs = require(`fs`).promises;
const {
  getRandomInt,
  shuffle,
} = require(`../../utils`);
const sequelize = require(`../lib/sequelize`);
const {getLogger} = require(`../lib/logger`);
const initDatabase = require(`../lib/init-db`);
const passwordUtils = require(`../lib/password`);

const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_PUBLICATIONS_PATH = `./data/publications.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;

const DEFAULT_COUNT = 1;
const MAX_COMMENTS = 4;

const PictureRestrict = {
  MIN: 1,
  MAX: 16,
};

const logger = getLogger({});

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);
  } catch (err) {
    logger.error(`Error when reading file: ${err.message}`);
    return [];
  }
};

const generateComments = (count, comments, users) => (
  Array(count).fill({}).map(() => ({
    user: users[getRandomInt(0, users.length - 1)].email,
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `)
  }))
);

const getPictureFileName = (number) => `item${number.toString().padStart(2, `0`)}.jpg`;

const getRandomSubarray = (items) => {
  items = items.slice();
  let count = getRandomInt(1, items.length - 1);
  const result = [];
  while (count--) {
    result.push(
        ...items.splice(
            getRandomInt(0, items.length - 1), 1
        )
    );
  }
  return result;
};

const generateArticles = (count, titles, publications, categories, comments, users) => (
  Array(count).fill({}).map(() => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    announce: shuffle(publications).slice(1, 2).join(` `),
    picture: getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)),
    fullText: shuffle(publications).slice(0, (getRandomInt(1, publications.length))).join(` `),
    categories: getRandomSubarray(categories),
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments, users),
  }))
);

module.exports = {
  name: `--filldb`,
  async run(args) {
    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`An error occurred: ${err.message}`);
      process.exit(1);
    }
    logger.info(`Connection to database established`);

    const titles = await readContent(FILE_TITLES_PATH);
    const publications = await readContent(FILE_PUBLICATIONS_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const comments = await readContent(FILE_COMMENTS_PATH);
    const users = [
      {
        name: `Иван`,
        surname: `Иванов`,
        email: `ivanov@example.com`,
        passwordHash: passwordUtils.hashSync(`ivanov`),
        avatar: `avatar01.jpg`,
        role: `administrator`
      },
      {
        name: `Пётр`,
        surname: `Петров`,
        email: `petrov@example.com`,
        passwordHash: passwordUtils.hashSync(`petrov`),
        avatar: `avatar02.jpg`,
        role: `reader`
      }
    ];

    const [count] = args;
    const countArticle = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const articles = generateArticles(countArticle, titles, publications, categories, comments, users);
    return initDatabase(sequelize, {articles, categories, users});
  }
};
