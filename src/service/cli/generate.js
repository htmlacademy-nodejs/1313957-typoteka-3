'use strict';

const {nanoid} = require(`nanoid`);
const chalk = require(`chalk`);
const fs = require(`fs`).promises;
const DEFAULT_COUNT = 1;
const MAX_COUNT = 1000;
const FILE_NAME = `mocks.json`;

const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_PUBLICATIONS_PATH = `./data/publications.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const {
  getRandomInt,
  shuffle,
  createRandomDate,
} = require(`../../utils`);

const {MAX_ID_LENGTH} = require(`../../constants`);
const MAX_COMMENTS = 4;

const generateComments = (count, comments) => (
  Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
  }))
);

const PictureRestrict = {
  MIN: 1,
  MAX: 16,
};

const getPictureFileName = (number) => `item${number.toString().padStart(2, `0`)}.jpg`;

const generateOffers = (count, titles, publications, categories, comments) => (
  Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    title: titles[getRandomInt(0, titles.length - 1)],
    createdDate: createRandomDate(new Date()),
    announce: shuffle(publications).slice(1, 5).join(` `),
    picture: getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)),
    fullText: shuffle(publications).slice(0, (getRandomInt(1, publications.length))).join(` `),
    category: shuffle(categories).slice(0, (getRandomInt(1, categories.length))).join(`,`).split(`,`),
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments),
  }))
);

module.exports = {
  name: `--generate`,
  async run(args) {
    const titles = await readContent(FILE_TITLES_PATH);
    const publications = await readContent(FILE_PUBLICATIONS_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const comments = await readContent(FILE_COMMENTS_PATH);

    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    if (countOffer > MAX_COUNT) {
      console.error(chalk.yellow(`Не больше 1000 публикаций`));
      return;
    }
    const content = JSON.stringify(generateOffers(countOffer, titles, publications, categories, comments), null, 2);
    try {
      await fs.writeFile(FILE_NAME, content);
      console.log(chalk.green(`Operation success. File created.`));
    } catch (error) {
      console.error(chalk.red(`Can't write data to file...`));
    }
  }
};
