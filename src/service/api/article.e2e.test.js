'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../lib/init-db`);
const passwordUtils = require(`../lib/password`);
const article = require(`./article`);
const DataService = require(`../data-service/article`);

const {HttpCode} = require(`../../constants`);

const mockCategories = [
  `Деревья`,
  `За жизнь`,
  `Без рамки`,
  `Разное`,
  `IT`,
  `Музыка`,
  `Кино`,
  `Программирование`,
  `Железо`
];

const mockUsers = [
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

const mockArticles = [
  {
    "title": `Как достигнуть успеха не вставая с кресла`,
    "announce": `Достичь успеха помогут ежедневные повторения. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Программировать не настолько сложно как об этом говорят. Простые ежедневные упражнения помогут достичь успеха.`,
    "picture": `item12.jpg`,
    "fullText": `Простые ежедневные упражнения помогут достичь успеха. Золотое сечение — соотношение двух величин гармоническая пропорция. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Программировать не настолько сложно как об этом говорят. Как начать действовать? Для начала просто соберитесь. Ёлки — это не просто красивое дерево. Это прочная древесина. Из под его пера вышло 8 платиновых альбомов. Достичь успеха помогут ежедневные повторения.`,
    "categories": [
      `IT`,
      `Программирование`
    ],
    "comments": [
      {
        "user": `petrov@example.com`,
        "text": `Мне кажется или я уже читал это где-то? Планируете записать видосик на эту тему?`
      },
      {
        "user": `ivanov@example.com`,
        "text": `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Согласен с автором! Планируете записать видосик на эту тему?`
      },
      {
        "user": `petrov@example.com`,
        "text": `Планируете записать видосик на эту тему? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Совсем немного...`
      }
    ]
  },
  {
    "title": `Как собрать камни бесконечности`,
    "announce": `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Игры и программирование разные вещи. Не стоит идти в программисты если вам нравятся только игры. Достичь успеха помогут ежедневные повторения. Как начать действовать? Для начала просто соберитесь.`,
    "picture": `item09.jpg`,
    "fullText": `Как начать действовать? Для начала просто соберитесь. Золотое сечение — соотношение двух величин гармоническая пропорция. Это один из лучших рок-музыкантов. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Программировать не настолько сложно как об этом говорят. Достичь успеха помогут ежедневные повторения. Этот смартфон — настоящая находка. Большой и яркий экран мощнейший процессор — всё это в небольшом гаджете. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Простые ежедневные упражнения помогут достичь успеха. Он написал больше 30 хитов. Игры и программирование разные вещи. Не стоит идти в программисты если вам нравятся только игры. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
    "categories": [
      `Деревья`,
      `Кино`,
      `Без рамки`,
      `Разное`,
      `Железо`,
      `Музыка`,
      `Программирование`,
      `IT`,
      `За жизнь`
    ],
    "comments": [
      {
        "user": `ivanov@example.com`,
        "text": `Согласен с автором! Планируете записать видосик на эту тему? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`
      },
      {
        "user": `petrov@example.com`,
        "text": `Хочу такую же футболку :-) Согласен с автором! Плюсую, но слишком много буквы!`
      }
    ]
  },
  {
    "title": `Рок — это протест`,
    "announce": `Программировать не настолько сложно как об этом говорят. Первая большая ёлка была установлена только в 1938 году. Собрать камни бесконечности легко если вы прирожденный герой. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
    "picture": `item05.jpg`,
    "fullText": `Ёлки — это не просто красивое дерево. Это прочная древесина. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Это один из лучших рок-музыкантов. Первая большая ёлка была установлена только в 1938 году. Программировать не настолько сложно как об этом говорят. Игры и программирование разные вещи. Не стоит идти в программисты если вам нравятся только игры. Достичь успеха помогут ежедневные повторения. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Из под его пера вышло 8 платиновых альбомов. Золотое сечение — соотношение двух величин гармоническая пропорция. Этот смартфон — настоящая находка. Большой и яркий экран мощнейший процессор — всё это в небольшом гаджете. Как начать действовать? Для начала просто соберитесь. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Простые ежедневные упражнения помогут достичь успеха.`,
    "categories": [
      `За жизнь`,
      `IT`,
      `Кино`,
      `Музыка`,
      `Программирование`,
      `Без рамки`,
      `Деревья`
    ],
    "comments": [
      {
        "user": `ivanov@example.com`,
        "text": `Мне кажется или я уже читал это где-то? Плюсую, но слишком много буквы! Это где ж такие красоты?`
      },
      {
        "user": `petrov@example.com`,
        "text": `Согласен с автором! Совсем немного... Хочу такую же футболку :-)`
      }
    ]
  },
  {
    "title": `Как достигнуть успеха не вставая с кресла`,
    "announce": `Собрать камни бесконечности легко если вы прирожденный герой. Первая большая ёлка была установлена только в 1938 году. Игры и программирование разные вещи. Не стоит идти в программисты если вам нравятся только игры. Из под его пера вышло 8 платиновых альбомов.`,
    "picture": `item11.jpg`,
    "fullText": `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Этот смартфон — настоящая находка. Большой и яркий экран мощнейший процессор — всё это в небольшом гаджете. Это один из лучших рок-музыкантов. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Достичь успеха помогут ежедневные повторения. Из под его пера вышло 8 платиновых альбомов.`,
    "categories": [
      `Музыка`
    ],
    "comments": [
      {
        "user": `ivanov@example.com`,
        "text": `Хочу такую же футболку :-) Плюсую, но слишком много буквы! Это где ж такие красоты?`
      },
      {
        "user": `ivanov@example.com`,
        "text": `Мне кажется или я уже читал это где-то? Совсем немного...`
      },
      {
        "user": `petrov@example.com`,
        "text": `Согласен с автором!`
      }
    ]
  },
  {
    "title": `Что такое золотое сечение`,
    "announce": `Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Ёлки — это не просто красивое дерево. Это прочная древесина. Игры и программирование разные вещи. Не стоит идти в программисты если вам нравятся только игры. Как начать действовать? Для начала просто соберитесь.`,
    "picture": `item06.jpg`,
    "fullText": `Простые ежедневные упражнения помогут достичь успеха. Первая большая ёлка была установлена только в 1938 году. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
    "categories": [
      `IT`
    ],
    "comments": [
      {
        "user": `petrov@example.com`,
        "text": `Плюсую, но слишком много буквы! Согласен с автором!`
      },
      {
        "user": `ivanov@example.com`,
        "text": `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Хочу такую же футболку :-) Согласен с автором!`
      },
      {
        "user": `petrov@example.com`,
        "text": `Это где ж такие красоты? Мне кажется или я уже читал это где-то?`
      },
      {
        "user": `petrov@example.com`,
        "text": `Плюсую, но слишком много буквы! Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`
      }
    ]
  }
];

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  await initDB(mockDB, {categories: mockCategories, articles: mockArticles, users: mockUsers});
  const app = express();
  app.use(express.json());
  article(app, new DataService(mockDB));
  return app;
};

describe(`API returns a list of all articles`, () => {

  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns a list of 5 articles`, () => expect(response.body.length).toBe(5));

  test(`First article's title  equals "Что такое золотое сечение"`, () => expect(response.body[0].title).toBe(`Что такое золотое сечение`));

});

describe(`API returns an article with given id`, () => {

  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .get(`/articles/2`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Article's title is "Как собрать камни бесконечности"`, () => expect(response.body.title).toBe(`Как собрать камни бесконечности`));

});

describe(`API creates an article if data is valid`, () => {

  const newArticle = {
    title: `Как достигнуть успеха не вставая с кресла`,
    announce: `Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
    picture: `item06.jpg`,
    userId: 1,
    fullText: `Простые ежедневные упражнения помогут достичь успеха. Первая большая ёлка была установлена только в 1938 году.`,
    categories: [1, 2]
  };

  let app; let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .post(`/articles`)
      .send(newArticle);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Articles count is changed`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(6))
  );

});

describe(`API refuses to create an article if data is invalid`, () => {

  const newArticle = {
    title: `Как достигнуть успеха не вставая с кресла`,
    announce: `Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
    fullText: `Простые ежедневные упражнения помогут достичь успеха. Первая большая ёлка была установлена только в 1938 году.`,
    categories: [1, 2]
  };

  let app;

  beforeAll(async () => {
    app = await createAPI();
  });

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newArticle)) {
      const badArticle = {...newArticle};
      delete badArticle[key];
      await request(app)
        .post(`/articles`)
        .send(badArticle)
        .expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`When field type is wrong response code is 400`, async () => {
    const badArticles = [
      {...newArticle, title: true},
      {...newArticle, picture: 12345},
      {...newArticle, categories: `Болталка`}
    ];
    for (const badArticle of badArticles) {
      await request(app)
        .post(`/articles`)
        .send(badArticle)
        .expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`When field value is wrong response code is 400`, async () => {
    const badArticles = [
      {...newArticle, title: `is short`},
      {...newArticle, announce: `too short`},
      {...newArticle, categories: []}
    ];
    for (const badArticle of badArticles) {
      await request(app)
        .post(`/articles`)
        .send(badArticle)
        .expect(HttpCode.BAD_REQUEST);
    }
  });

});

describe(`API changed an existing article`, () => {

  const newArticle = {
    title: `Рок — это протест. Давайте продлим заголовок для валидатора.`,
    announce: `Простые ежедневные упражнения помогут достичь успеха. Золотое сечение — соотношение двух величин гармоническая пропорция.`,
    fullText: `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Этот смартфон — настоящая находка. Большой и яркий экран мощнейший процессор — всё это в небольшом гаджете.`,
    userId: 1,
    categories: [2],
  };

  let app; let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .put(`/articles/2`)
      .send(newArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Article is really changed`, () => request(app)
    .get(`/articles/2`)
    .expect((res) => expect(res.body.title).toBe(`Рок — это протест. Давайте продлим заголовок для валидатора.`))
  );

});

test(`API returns a 404 status code when trying to change a non-existent article`, async () => {

  const app = await createAPI();

  const validArticle = {
    title: `Это валидный`,
    announce: `объект`,
    fullText: `публикации однако`,
    categories: [3]
  };

  return request(app)
    .get(`/articles/20`)
    .send(validArticle)
    .expect(HttpCode.NOT_FOUND);

});

test(`API returns status code 400 when trying to change an article with invalid data`, async () => {

  const app = await createAPI();

  const invalidArticle = {
    title: `Это невалидный`,
    announce: `объект`,
    fullText: `нет категорий`,
  };

  return request(app)
    .put(`/articles/20`)
    .send(invalidArticle)
    .expect(HttpCode.BAD_REQUEST);

});

describe(`API correctly deletes an article`, () => {

  let app; let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .delete(`/articles/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Article count is 2 now`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(4))
  );

});

test(`API refuses to delete non-existent articles`, async () => {

  const app = await createAPI();

  return request(app)
    .delete(`/articles/20`)
    .expect(HttpCode.NOT_FOUND);

});

