'use strict';

const chalk = require(`chalk`);
const fs = require(`fs`).promises;
const DEFAULT_COUNT = 1;
const MAX_COUNT = 1000;
const FILE_NAME = `mocks.json`;

const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_PUBLICATIONS_PATH = `./data/publications.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;

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

const generateOffers = (count, titles, publications, categories) => (
  Array(count).fill({}).map(() => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    announce: shuffle(publications).slice(1, 5).join(` `),
    fullText: shuffle(publications).slice(1, (getRandomInt(1, publications.length))).join(` `),
    createdDate: createRandomDate(new Date()),
    category: shuffle(categories).slice(1, (getRandomInt(1, categories.length))).join(`,`).split(`,`),
  }))
);

module.exports = {
  name: `--generate`,
  async run(args) {
    const titles = await readContent(FILE_TITLES_PATH);
    const publications = await readContent(FILE_PUBLICATIONS_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);

    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    if (countOffer > MAX_COUNT) {
      console.error(chalk.yellow(`Не больше 1000 публикаций`));
      return;
    }
    const content = JSON.stringify(generateOffers(countOffer, titles, publications, categories), null, 2);
    try {
      await fs.writeFile(FILE_NAME, content);
      console.log(chalk.green(`Operation success. File created.`));
    } catch (error) {
      console.error(chalk.red(`Can't write data to file...`));
    }
  }
};
