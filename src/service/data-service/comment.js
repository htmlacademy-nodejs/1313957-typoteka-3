'use strict';

const Alias = require(`../models/alias`);

class CommentService {
  constructor(sequelize) {
    this._Comment = sequelize.models.Comment;
    this._User = sequelize.models.User;
  }

  async create(articleId, comment) {
    return await this._Comment.create({
      articleId,
      ...comment
    });
  }

  async findAll(articleId) {
    return this._Comment.findAll({
      where: {articleId},
      raw: true
    });
  }

  async findLastComments(limit) {
    const comments = await this._Comment.findAll({
      attributes: [`articleId`, `text`, `createdAt`],
      include: [
        {
          model: this._User,
          as: Alias.USERS,
          attributes: [`avatar`, `name`, `surname`],
        },
      ],
      order: [[`createdAt`, `DESC`]],
      limit,
      subQuery: false,
    });

    return comments.map((article) => article.get());
  }

  async drop(id) {
    const deletedRows = await this._Comment.destroy({
      where: {id}
    });

    return !!deletedRows;
  }
}

module.exports = CommentService;
