'use strict';

const {Model} = require(`sequelize`);
const defineCategory = require(`./category`);
const defineArticle = require(`./article`);
const defineComment = require(`./comment`);
const defineUser = require(`./user`);
const Alias = require(`./alias`);

class ArticleCategory extends Model {

}

const define = (sequelize) => {
  const Category = defineCategory(sequelize);
  const Article = defineArticle(sequelize);
  const Comment = defineComment(sequelize);
  const User = defineUser(sequelize);

  Article.hasMany(Comment, {as: Alias.COMMENTS, foreignKey: `articleId`, onDelete: `cascade`});
  Comment.belongsTo(Article, {as: Alias.ARTICLES, foreignKey: `articleId`});

  ArticleCategory.init({}, {sequelize, modelName: `ArticleCategory`, tableName: `articleCategory`});

  Article.belongsToMany(Category, {through: ArticleCategory, as: Alias.CATEGORIES, foreignKey: `articleId`});
  Category.belongsToMany(Article, {through: ArticleCategory, as: Alias.ARTICLES, foreignKey: `categoryId`});
  Category.hasMany(ArticleCategory, {as: Alias.ARTICLE_CATEGORIES, foreignKey: `categoryId`});
  Article.hasMany(ArticleCategory, {as: Alias.ARTICLE_CATEGORIES, foreignKey: `articleId`});

  User.hasMany(Article, {as: Alias.ARTICLES, foreignKey: `userId`});
  Article.belongsTo(User, {as: Alias.USERS, foreignKey: `userId`});

  User.hasMany(Comment, {as: Alias.COMMENTS, foreignKey: `userId`});
  Comment.belongsTo(User, {as: Alias.USERS, foreignKey: `userId`});

  return {Category, Comment, Article, ArticleCategory, User};
};

module.exports = define;
