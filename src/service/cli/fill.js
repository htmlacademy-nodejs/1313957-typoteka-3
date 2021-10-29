'use strict';

const chalk = require(`chalk`);
const fs = require(`fs`).promises;
const {
  getRandomInt,
  shuffle,
  createRandomDate,
} = require(`../../utils`);

const DEFAULT_COUNT = 1;
const MAX_COMMENTS = 4;

const FILE_NAME = `fill-db.sql`;
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

const generateComments = (count, articleId, userCount, comments) => (
  Array(count).fill({}).map(() => ({
    userId: getRandomInt(1, userCount),
    articleId,
    createdDate: createRandomDate(),
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

const generateArticles = (count, titles, categoryCount, userCount, publications, comments) => (
  Array(count).fill({}).map((_, index) => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    createdDate: createRandomDate(),
    picture: getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)),
    announce: shuffle(publications).slice(1, 3).join(` `),
    text: shuffle(publications).slice(0, (getRandomInt(1, publications.length))).join(` `),
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), index + 1, userCount, comments),
    categoryId: [getRandomInt(1, categoryCount)],
    userId: getRandomInt(1, userCount)
  }))
);


module.exports = {
  name: `--fill`,
  async run(args) {
    const titles = await readContent(FILE_TITLES_PATH);
    const publications = await readContent(FILE_PUBLICATIONS_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const commentSentences = await readContent(FILE_COMMENTS_PATH);

    const [count] = args;
    const countArticle = Number.parseInt(count, 10) || DEFAULT_COUNT;

    const users = [
      {
        email: `ivanov@example.com`,
        passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
        firstName: `Иван`,
        lastName: `Иванов`,
        avatar: `avatar1.jpg`
      },
      {
        email: `petrov@example.com`,
        passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
        firstName: `Пётр`,
        lastName: `Петров`,
        avatar: `avatar2.jpg`
      }
    ];

    const articles = generateArticles(countArticle, titles, categories.length, users.length, publications, commentSentences);

    const comments = articles.flatMap((article) => article.comments);

    const articleCategories = articles.map((article, index) => ({
      articleId: index + 1,
      categoryId: article.categoryId[0]
    }));

    const userValues = users.map(
        ({email, firstName, lastName, passwordHash, avatar}) =>
          `('${email}', '${firstName}', '${lastName}', '${passwordHash}', '${avatar}')`
    ).join(`,\n`);

    const categoryValues = categories.map((name) => `('${name}')`).join(`,\n`);

    const articleValues = articles.map(
        ({title, createdDate, picture, announce, text, categoryId, userId}) =>
          `('${title}', '${createdDate}', '${picture}', '${announce}', '${text}', ARRAY[${categoryId}], '${userId}')`
    ).join(`,\n`);

    const commentValues = comments.map(
        ({text, createdDate, userId, articleId}) =>
          `('${text}','${createdDate}', ${userId}, ${articleId})`
    ).join(`,\n`);

    const articleCategoryValues = articleCategories.map(
        ({articleId, categoryId}) =>
          `(${articleId}, ${categoryId})`
    ).join(`,\n`);

    const content = `
      INSERT INTO typoteka.public.users (email, first_name, last_name, password_hash, avatar) VALUES ${userValues};

      INSERT INTO typoteka.public.categories(name) VALUES ${categoryValues};

      ALTER TABLE typoteka.public.articles DISABLE TRIGGER ALL;
      INSERT INTO typoteka.public.articles(title, created_at, picture, announce, text, category_id, user_id) VALUES  ${articleValues};
      ALTER TABLE typoteka.public.articles ENABLE TRIGGER ALL;

      ALTER TABLE typoteka.public.comments DISABLE TRIGGER ALL;
      INSERT INTO typoteka.public.comments(text, created_at, user_id, article_id) VALUES ${commentValues};
      ALTER TABLE typoteka.public.comments ENABLE TRIGGER ALL;

      ALTER TABLE typoteka.public.article_categories DISABLE TRIGGER ALL;
      INSERT INTO typoteka.public.article_categories VALUES  ${articleCategoryValues};
      ALTER TABLE typoteka.public.article_categories ENABLE TRIGGER ALL;`;

    try {
      await fs.writeFile(FILE_NAME, content);
      console.log(chalk.green(`Operation success. File created.`));
    } catch (error) {
      console.error(chalk.red(`Can't write data to file...`));
    }
  }
};
