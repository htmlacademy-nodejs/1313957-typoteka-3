INSERT INTO typoteka.public.users (email, first_name, last_name, password_hash, avatar)
VALUES ('ivanov@example.com', 'Иван', 'Иванов', '5f4dcc3b5aa765d61d8327deb882cf99', 'avatar1.jpg'),
       ('petrov@example.com', 'Пётр', 'Петров', '5f4dcc3b5aa765d61d8327deb882cf99', 'avatar2.jpg');

INSERT INTO typoteka.public.categories(name)
VALUES ('Деревья'),
       ('За жизнь'),
       ('Без рамки'),
       ('Разное'),
       ('IT'),
       ('Музыка'),
       ('Кино'),
       ('Программирование'),
       ('Железо');

ALTER TABLE typoteka.public.articles
  DISABLE TRIGGER ALL;
INSERT INTO typoteka.public.articles(title, created_at, picture, announce, text, user_id)
VALUES ('Ёлки. История деревьев', '2021.09.26, 11:57:25', 'item06.jpg',
        'Он написал больше 30 хитов. Этот смартфон — настоящая находка. Большой и яркий экран мощнейший процессор — всё это в небольшом гаджете.',
        'Ёлки — это не просто красивое дерево. Это прочная древесина. Золотое сечение — соотношение двух величин гармоническая пропорция. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Он написал больше 30 хитов. Это один из лучших рок-музыкантов. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Программировать не настолько сложно как об этом говорят. Этот смартфон — настоящая находка. Большой и яркий экран мощнейший процессор — всё это в небольшом гаджете. Собрать камни бесконечности легко если вы прирожденный герой. Из под его пера вышло 8 платиновых альбомов. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Как начать действовать? Для начала просто соберитесь. Достичь успеха помогут ежедневные повторения. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Простые ежедневные упражнения помогут достичь успеха. Первая большая ёлка была установлена только в 1938 году. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Игры и программирование разные вещи. Не стоит идти в программисты если вам нравятся только игры.',
        '2'),
       ('Лучшие рок-музыканты 20-века', '2021.09.28, 06:23:49', 'item08.jpg',
        'Достичь успеха помогут ежедневные повторения. Золотое сечение — соотношение двух величин гармоническая пропорция.',
        'Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Собрать камни бесконечности легко если вы прирожденный герой. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Ёлки — это не просто красивое дерево. Это прочная древесина. Из под его пера вышло 8 платиновых альбомов. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Игры и программирование разные вещи. Не стоит идти в программисты если вам нравятся только игры. Первая большая ёлка была установлена только в 1938 году. Как начать действовать? Для начала просто соберитесь. Программировать не настолько сложно как об этом говорят. Простые ежедневные упражнения помогут достичь успеха. Этот смартфон — настоящая находка. Большой и яркий экран мощнейший процессор — всё это в небольшом гаджете. Золотое сечение — соотношение двух величин гармоническая пропорция. Достичь успеха помогут ежедневные повторения. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Он написал больше 30 хитов. Это один из лучших рок-музыкантов.',
        '1'),
       ('Как достигнуть успеха не вставая с кресла', '2021.09.12, 06:56:30', 'item16.jpg',
        'Этот смартфон — настоящая находка. Большой и яркий экран мощнейший процессор — всё это в небольшом гаджете. Программировать не настолько сложно как об этом говорят.',
        'Как начать действовать? Для начала просто соберитесь. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Достичь успеха помогут ежедневные повторения. Ёлки — это не просто красивое дерево. Это прочная древесина.',
        '1'),
       ('Как перестать беспокоиться и начать жить', '2021.10.20, 07:05:57', 'item10.jpg',
        'Он написал больше 30 хитов. Собрать камни бесконечности легко если вы прирожденный герой.',
        'Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Ёлки — это не просто красивое дерево. Это прочная древесина. Как начать действовать? Для начала просто соберитесь. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Собрать камни бесконечности легко если вы прирожденный герой. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Золотое сечение — соотношение двух величин гармоническая пропорция. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Простые ежедневные упражнения помогут достичь успеха. Из под его пера вышло 8 платиновых альбомов. Программировать не настолько сложно как об этом говорят.',
        '2'),
       ('Рок — это протест', '2021.08.11, 03:05:58', 'item09.jpg',
        'Простые ежедневные упражнения помогут достичь успеха. Игры и программирование разные вещи. Не стоит идти в программисты если вам нравятся только игры.',
        'Это один из лучших рок-музыкантов. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Собрать камни бесконечности легко если вы прирожденный герой. Он написал больше 30 хитов. Достичь успеха помогут ежедневные повторения. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Как начать действовать? Для начала просто соберитесь. Первая большая ёлка была установлена только в 1938 году. Этот смартфон — настоящая находка. Большой и яркий экран мощнейший процессор — всё это в небольшом гаджете. Простые ежедневные упражнения помогут достичь успеха. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Программировать не настолько сложно как об этом говорят. Золотое сечение — соотношение двух величин гармоническая пропорция. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Игры и программирование разные вещи. Не стоит идти в программисты если вам нравятся только игры. Из под его пера вышло 8 платиновых альбомов. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Ёлки — это не просто красивое дерево. Это прочная древесина.',
        '2'),
       ('Самый лучший музыкальный альбом этого года', '2021.10.26, 01:11:55', 'item09.jpg',
        'Этот смартфон — настоящая находка. Большой и яркий экран мощнейший процессор — всё это в небольшом гаджете. Как начать действовать? Для начала просто соберитесь.',
        'Первая большая ёлка была установлена только в 1938 году. Как начать действовать? Для начала просто соберитесь. Он написал больше 30 хитов. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Достичь успеха помогут ежедневные повторения. Из под его пера вышло 8 платиновых альбомов. Это один из лучших рок-музыкантов. Золотое сечение — соотношение двух величин гармоническая пропорция.',
        '1'),
       ('Обзор новейшего смартфона', '2021.09.27, 01:02:06', 'item11.jpg',
        'Достичь успеха помогут ежедневные повторения. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.',
        'Он написал больше 30 хитов. Это один из лучших рок-музыкантов. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Игры и программирование разные вещи. Не стоит идти в программисты если вам нравятся только игры. Этот смартфон — настоящая находка. Большой и яркий экран мощнейший процессор — всё это в небольшом гаджете. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.',
        '1'),
       ('Обзор новейшего смартфона', '2021.10.20, 12:58:05', 'item03.jpg',
        'Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Вы можете достичь всего. Стоит только немного постараться и запастись книгами.',
        'Программировать не настолько сложно как об этом говорят.', '2'),
       ('Ёлки. История деревьев', '2021.08.25, 10:59:50', 'item13.jpg',
        'Простые ежедневные упражнения помогут достичь успеха. Вы можете достичь всего. Стоит только немного постараться и запастись книгами.',
        'Простые ежедневные упражнения помогут достичь успеха. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Собрать камни бесконечности легко если вы прирожденный герой. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Игры и программирование разные вещи. Не стоит идти в программисты если вам нравятся только игры.',
        '1'),
       ('Рок — это протест', '2021.09.03, 07:27:49', 'item06.jpg',
        'Программировать не настолько сложно как об этом говорят. Простые ежедневные упражнения помогут достичь успеха.',
        'Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Достичь успеха помогут ежедневные повторения. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Ёлки — это не просто красивое дерево. Это прочная древесина. Он написал больше 30 хитов. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Программировать не настолько сложно как об этом говорят. Это один из лучших рок-музыкантов. Собрать камни бесконечности легко если вы прирожденный герой. Простые ежедневные упражнения помогут достичь успеха. Первая большая ёлка была установлена только в 1938 году. Золотое сечение — соотношение двух величин гармоническая пропорция. Этот смартфон — настоящая находка. Большой и яркий экран мощнейший процессор — всё это в небольшом гаджете.',
        '2');
ALTER TABLE typoteka.public.articles
  ENABLE TRIGGER ALL;

ALTER TABLE typoteka.public.comments
  DISABLE TRIGGER ALL;
INSERT INTO typoteka.public.comments(text, created_at, user_id, article_id)
VALUES ('Планируете записать видосик на эту тему?', '2021.08.07, 11:23:40', 1, 1),
       ('Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.', '2021.09.02, 03:24:10', 1, 1),
       ('Мне кажется или я уже читал это где-то?', '2021.09.30, 08:28:53', 1, 1),
       ('Это где ж такие красоты?', '2021.09.15, 03:45:30', 2, 2),
       ('Планируете записать видосик на эту тему? Согласен с автором!', '2021.08.23, 02:17:31', 2, 3),
       ('Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Это где ж такие красоты? Планируете записать видосик на эту тему?',
        '2021.10.05, 09:08:02', 2, 4),
       ('Мне кажется или я уже читал это где-то?', '2021.10.10, 08:13:39', 1, 4),
       ('Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Планируете записать видосик на эту тему? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.',
        '2021.08.29, 05:40:10', 1, 5),
       ('Хочу такую же футболку :-) Согласен с автором! Совсем немного...', '2021.10.03, 11:41:09', 2, 5),
       ('Мне кажется или я уже читал это где-то? Совсем немного...', '2021.10.27, 02:01:11', 1, 5),
       ('Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.', '2021.10.07, 09:36:51', 1, 6),
       ('Это где ж такие красоты?', '2021.10.01, 11:31:52', 1, 7),
       ('Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Плюсую, но слишком много буквы! Хочу такую же футболку :-)',
        '2021.08.02, 04:39:33', 2, 7),
       ('Мне кажется или я уже читал это где-то? Согласен с автором! Планируете записать видосик на эту тему?',
        '2021.09.06, 09:42:48', 2, 7),
       ('Совсем немного... Планируете записать видосик на эту тему?', '2021.09.16, 12:34:17', 1, 7),
       ('Мне кажется или я уже читал это где-то?', '2021.08.19, 04:33:02', 2, 8),
       ('Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Мне кажется или я уже читал это где-то? Хочу такую же футболку :-)',
        '2021.09.10, 08:15:38', 1, 8),
       ('Планируете записать видосик на эту тему? Хочу такую же футболку :-) Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.',
        '2021.08.23, 06:32:51', 1, 9),
       ('Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Плюсую, но слишком много буквы!',
        '2021.08.31, 01:19:37', 1, 9),
       ('Хочу такую же футболку :-) Совсем немного... Планируете записать видосик на эту тему?', '2021.08.23, 02:37:14',
        2, 10),
       ('Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Хочу такую же футболку :-)',
        '2021.08.13, 02:33:22', 1, 10),
       ('Мне кажется или я уже читал это где-то? Согласен с автором! Это где ж такие красоты?', '2021.10.07, 05:58:28',
        2, 10);
ALTER TABLE typoteka.public.comments
  ENABLE TRIGGER ALL;

ALTER TABLE typoteka.public.article_categories
  DISABLE TRIGGER ALL;
INSERT INTO typoteka.public.article_categories
VALUES (1, 5),
       (1, 2),
       (2, 5),
       (3, 4),
       (3, 1),
       (3, 3),
       (4, 2),
       (4, 4),
       (5, 2),
       (6, 2),
       (6, 1),
       (7, 6),
       (7, 3),
       (7, 2),
       (8, 3),
       (9, 2),
       (10, 1);
ALTER TABLE typoteka.public.article_categories
  ENABLE TRIGGER ALL;