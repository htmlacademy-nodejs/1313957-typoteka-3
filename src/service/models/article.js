'use strict';

const {DataTypes, Model} = require(`sequelize`);
const {ARTICLE_MODEL_DEFINE} = require(`../../constants.js`);
const {titleLength, pictureLength, announceLength} = ARTICLE_MODEL_DEFINE;
class Article extends Model {

}

const define = (sequelize) => Article.init({
  title: {
    // eslint-disable-next-line new-cap
    type: DataTypes.STRING(titleLength),
    allowNull: false
  },
  // eslint-disable-next-line new-cap
  picture: DataTypes.STRING(pictureLength),
  announce: {
    // eslint-disable-next-line new-cap
    type: DataTypes.STRING(announceLength),
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


module.exports = define;
