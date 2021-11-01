SELECT *
FROM categories;

SELECT id, name
FROM categories
       JOIN article_categories ac
            ON categories.id = ac.category_id
GROUP BY id;

SELECT id, name, count(article_id)
FROM categories
       LEFT JOIN article_categories
                 ON categories.id = article_categories.category_id
GROUP BY id, name;

SELECT articles.id,
       articles.title,
       articles.announce,
       articles.created_at,
       users.first_name,
       users.last_name,
       users.email,
       COUNT(comments.id)                         AS comments_count,
       STRING_AGG(DISTINCT categories.name, ', ') AS category_list
FROM articles
       JOIN article_categories ON articles.id = article_categories.article_id
       JOIN categories ON article_categories.category_id = categories.id
       LEFT JOIN comments ON articles.id = comments.article_id
       JOIN users ON comments.user_id = users.id
GROUP BY articles.id, users.id, articles.created_at
ORDER BY articles.created_at DESC;

SELECT articles.id,
       articles.title,
       articles.announce,
       articles.text,
       articles.created_at,
       articles.picture,
       users.first_name,
       users.last_name,
       users.email,
       COUNT(comments.id)                         AS comments_count,
       STRING_AGG(DISTINCT categories.name, ', ') AS category_list
FROM articles
       JOIN article_categories ON articles.id = article_categories.article_id
       JOIN categories ON article_categories.category_id = categories.id
       JOIN users ON articles.user_id = users.id
       LEFT JOIN comments ON articles.id = comments.article_id
WHERE articles.id = 3
GROUP BY articles.id, users.id;

SELECT comments.id,
       comments.article_id,
       users.first_name,
       users.last_name,
       comments.text
FROM comments
       JOIN users ON comments.user_id = users.id
ORDER BY comments.created_at DESC
LIMIT 5;

SELECT comments.id,
       comments.article_id,
       users.first_name,
       users.last_name,
       comments.text
FROM comments
       JOIN users ON comments.user_id = users.id
WHERE comments.article_id = 1
ORDER BY comments.created_at DESC;

UPDATE
  articles
SET title = 'Как я встретил Новый год'
WHERE id = 1;










