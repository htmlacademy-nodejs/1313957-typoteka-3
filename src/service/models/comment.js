'use strict';

const {DataTypes, Model} = require(`sequelize`);

class CommentModel extends Model {

}

const define = (sequelize) => CommentModel.init({
  text: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: `Comment`,
  tableName: `comments`
});

const defineRelations = ({Article, Comment}) => {
  Comment.belongsTo(Article, {foreignKey: `articleId`});
};

module.exports = {define, defineRelations};
