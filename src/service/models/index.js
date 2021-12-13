'use strict';

const CategoryModel = require(`./category`);
const ArticleModel = require(`./article`);
const ArticleCategoryModel = require(`./article-category`);
const CommentModel = require(`./comment`);

const define = (sequelize) => {
  const Category = CategoryModel.define(sequelize);
  const Article = ArticleModel.define(sequelize);
  const ArticleCategory = ArticleCategoryModel.define(sequelize);
  const Comment = CommentModel.define(sequelize);

  [ArticleModel, CategoryModel, CommentModel].forEach((model) => model.defineRelations({
    Article,
    Category,
    Comment,
    ArticleCategory
  }));


  return {Category, Comment, Article, ArticleCategory};
};

module.exports = define;
