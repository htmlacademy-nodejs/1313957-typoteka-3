'use strict';

const express = require(`express`);
const request = require(`supertest`);

const comment = require(`./comment`);
const DataService = require(`../data-service/article`);
const CommentService = require(`../data-service/comment`);

const {HttpCode} = require(`../../constants`);

const mockData = [
  {
    "title": `Как достигнуть успеха не вставая с кресла`,
    "createdDate": `05.07.2021, 11:28:56`,
    "announce": `Достичь успеха помогут ежедневные повторения. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Программировать не настолько сложно как об этом говорят. Простые ежедневные упражнения помогут достичь успеха.`,
    "picture": `item12.jpg`,
    "fullText": `Простые ежедневные упражнения помогут достичь успеха. Золотое сечение — соотношение двух величин гармоническая пропорция. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Программировать не настолько сложно как об этом говорят. Как начать действовать? Для начала просто соберитесь. Ёлки — это не просто красивое дерево. Это прочная древесина. Из под его пера вышло 8 платиновых альбомов. Достичь успеха помогут ежедневные повторения.`,
    "id": `B7pVD5`,
    "category": [
      `IT`,
      `Программирование`
    ],
    "comments": [
      {
        "text": `Мне кажется или я уже читал это где-то? Планируете записать видосик на эту тему?`,
        "id": `oKcluo`
      },
      {
        "text": `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Согласен с автором! Планируете записать видосик на эту тему?`,
        "id": `bmaKrz`
      },
      {
        "text": `Планируете записать видосик на эту тему? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Совсем немного...`,
        "id": `ReWoy8`
      }
    ]
  },
  {
    "title": `Как собрать камни бесконечности`,
    "createdDate": `11.07.2021, 17:32:00`,
    "announce": `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Игры и программирование разные вещи. Не стоит идти в программисты если вам нравятся только игры. Достичь успеха помогут ежедневные повторения. Как начать действовать? Для начала просто соберитесь.`,
    "picture": `item09.jpg`,
    "fullText": `Как начать действовать? Для начала просто соберитесь. Золотое сечение — соотношение двух величин гармоническая пропорция. Это один из лучших рок-музыкантов. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Программировать не настолько сложно как об этом говорят. Достичь успеха помогут ежедневные повторения. Этот смартфон — настоящая находка. Большой и яркий экран мощнейший процессор — всё это в небольшом гаджете. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Простые ежедневные упражнения помогут достичь успеха. Он написал больше 30 хитов. Игры и программирование разные вещи. Не стоит идти в программисты если вам нравятся только игры. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
    "id": `vSouii`,
    "category": [
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
        "text": `Согласен с автором! Планируете записать видосик на эту тему? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`,
        "id": `EpA69Z`
      },
      {
        "text": `Хочу такую же футболку :-) Согласен с автором! Плюсую, но слишком много буквы!`,
        "id": `4GXdBI`
      }
    ]
  },
  {
    "title": `Рок — это протест`,
    "createdDate": `25.08.2021, 13:18:57`,
    "announce": `Программировать не настолько сложно как об этом говорят. Первая большая ёлка была установлена только в 1938 году. Собрать камни бесконечности легко если вы прирожденный герой. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
    "picture": `item05.jpg`,
    "fullText": `Ёлки — это не просто красивое дерево. Это прочная древесина. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Это один из лучших рок-музыкантов. Первая большая ёлка была установлена только в 1938 году. Программировать не настолько сложно как об этом говорят. Игры и программирование разные вещи. Не стоит идти в программисты если вам нравятся только игры. Достичь успеха помогут ежедневные повторения. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Из под его пера вышло 8 платиновых альбомов. Золотое сечение — соотношение двух величин гармоническая пропорция. Этот смартфон — настоящая находка. Большой и яркий экран мощнейший процессор — всё это в небольшом гаджете. Как начать действовать? Для начала просто соберитесь. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Простые ежедневные упражнения помогут достичь успеха.`,
    "id": `phmaLJ`,
    "category": [
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
        "text": `Мне кажется или я уже читал это где-то? Плюсую, но слишком много буквы! Это где ж такие красоты?`,
        "id": `6rXz4Z`
      },
      {
        "text": `Согласен с автором! Совсем немного... Хочу такую же футболку :-)`,
        "id": `WMdB4x`
      }
    ]
  },
  {
    "title": `Как достигнуть успеха не вставая с кресла`,
    "createdDate": `18.07.2021, 00:11:01`,
    "announce": `Собрать камни бесконечности легко если вы прирожденный герой. Первая большая ёлка была установлена только в 1938 году. Игры и программирование разные вещи. Не стоит идти в программисты если вам нравятся только игры. Из под его пера вышло 8 платиновых альбомов.`,
    "picture": `item11.jpg`,
    "fullText": `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Этот смартфон — настоящая находка. Большой и яркий экран мощнейший процессор — всё это в небольшом гаджете. Это один из лучших рок-музыкантов. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Достичь успеха помогут ежедневные повторения. Из под его пера вышло 8 платиновых альбомов.`,
    "id": `dzBUY3`,
    "category": [
      `Музыка`
    ],
    "comments": [
      {
        "text": `Хочу такую же футболку :-) Плюсую, но слишком много буквы! Это где ж такие красоты?`,
        "id": `Y_mZLc`
      },
      {
        "text": `Мне кажется или я уже читал это где-то? Совсем немного...`,
        "id": `2UJ4R7`
      },
      {
        "text": `Согласен с автором!`,
        "id": `Qtxb6-`
      }
    ]
  },
  {
    "title": `Что такое золотое сечение`,
    "createdDate": `02.07.2021, 10:54:50`,
    "announce": `Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Ёлки — это не просто красивое дерево. Это прочная древесина. Игры и программирование разные вещи. Не стоит идти в программисты если вам нравятся только игры. Как начать действовать? Для начала просто соберитесь.`,
    "picture": `item06.jpg`,
    "fullText": `Простые ежедневные упражнения помогут достичь успеха. Первая большая ёлка была установлена только в 1938 году. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
    "id": `3VG2aW`,
    "category": [
      `IT`
    ],
    "comments": [
      {
        "text": `Плюсую, но слишком много буквы! Согласен с автором!`,
        "id": `_cWCMo`
      },
      {
        "text": `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Хочу такую же футболку :-) Согласен с автором!`,
        "id": `GOyWuK`
      },
      {
        "text": `Это где ж такие красоты? Мне кажется или я уже читал это где-то?`,
        "id": `p0k8zB`
      },
      {
        "text": `Плюсую, но слишком много буквы! Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`,
        "id": `hFGXUv`
      }
    ]
  }
];

const createAPI = () => {
  const app = express();
  const cloneData = JSON.parse(JSON.stringify(mockData));
  app.use(express.json());
  comment(app, new DataService(cloneData), new CommentService());
  return app;
};

describe(`API returns a list of comment to given article`, () => {

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/articles/B7pVD5/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Return list of 3 comments`, () => expect(response.body.length).toBe(3));

  test(`First comment's id is oKcluo`, () => expect(response.body[0].id).toBe(`oKcluo`));

});

describe(`API creates a comment if data is valid`, () => {

  const newComment = {
    text: `Валидному комментарию достаточно этого поля`
  };
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/articles/B7pVD5/comments`)
      .send(newComment);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Returns comment created`, () => expect(response.body).toEqual(expect.objectContaining(newComment)));

  test(`Comment count is changed`, () => request(app)
    .get(`/articles/B7pVD5/comments`)
    .expect((res) => expect(res.body.length).toBe(4))
  );

});

test(`API refuses to create a comment to non-existent article and returns status code 404`, () => {

  const app = createAPI();

  return request(app)
    .post(`/articles/NOEXT/comments`)
    .send({
      text: `Неважно`
    })
    .expect(HttpCode.NOT_FOUND);

});

test(`API refuses to create a comment when data is invalid, and return status code 400`, () => {

  const app = createAPI();

  return request(app)
    .post(`/articles/B7pVD5/comments`)
    .send({})
    .expect(HttpCode.BAD_REQUEST);

});

describe(`API correctly deletes a comment`, () => {

  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/articles/dzBUY3/comments/2UJ4R7`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns comment deleted`, () => expect(response.body.id).toBe(`2UJ4R7`));

  test(`Comments count is 2 now`, () => request(app)
    .get(`/articles/dzBUY3/comments`)
    .expect((res) => expect(res.body.length).toBe(2))
  );

});

test(`API refuses to delete non-existent comment`, () => {

  const app = createAPI();

  return request(app)
    .delete(`/articles/dzBUY3/comments/NOEST`)
    .expect(HttpCode.NOT_FOUND);

});

test(`API refuses to delete a comment to non-existent article`, () =>{

  const app = createAPI();

  return request(app)
    .delete(`/articles/NOEXT/comments/2UJ4R7`)
    .expect(HttpCode.NOT_FOUND);

});
