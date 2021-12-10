'use strict';

const {DataTypes, Model} = require(`sequelize`);
const Aliase = require(`./aliase`);

class ArticleModel extends Model {

}

const define = (sequelize) => ArticleModel.init({
  title: {
    // eslint-disable-next-line new-cap
    type: DataTypes.STRING(250),
    allowNull: false
  },
  // eslint-disable-next-line new-cap
  picture: DataTypes.STRING(50),
  announce: {
    // eslint-disable-next-line new-cap
    type: DataTypes.STRING(250),
    allowNull: false
  },
  fullText: {
    // eslint-disable-next-line new-cap
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  sequelize,
  modelName: `Article`,
  tableName: `articles`
});

const defineRelations = ({Article, Category, Comment, ArticleCategory}) => {
  Article.hasMany(Comment, {as: Aliase.COMMENTS, foreignKey: `articleId`, onDelete: `cascade`});
  Article.belongsToMany(Category, {through: ArticleCategory, as: Aliase.CATEGORIES});
};

module.exports = {define, defineRelations};
