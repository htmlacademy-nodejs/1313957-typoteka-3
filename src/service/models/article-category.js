'use strict';

const {Model} = require(`sequelize`);

class ArticleCategoryModel extends Model {

}

const define = (sequelize) => ArticleCategoryModel.init({}, {
  sequelize,
  modelName: `ArticleCategory`,
  tableName: `articleCategory`
});

module.exports = {define};
