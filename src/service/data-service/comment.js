'use strict';

const Alias = require(`../models/alias`);

class CommentService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
    this._User = sequelize.models.User;
  }

  async create(articleId, comment) {
    return await this._Comment.create({
      articleId,
      ...comment
    });
  }

  async findOne(id) {
    return this._Comment.findOne({
      where: id,
      attributes: [`id`, `text`, `createdAt`],
      include: [
        {
          model: this._User,
          as: Alias.USERS,
          attributes: [`avatar`, `name`, `surname`],
        },
        {
          model: this._Article,
          as: Alias.ARTICLES,
          attributes: [`title`, `id`]
        }
      ],
      raw: true
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
      attributes: [`text`, `createdAt`],
      include: [
        {
          model: this._User,
          as: Alias.USERS,
          attributes: [`avatar`, `name`, `surname`],
        },
        {
          model: this._Article,
          as: Alias.ARTICLES,
          attributes: [`id`]
        }
      ],
      order: [[`createdAt`, `DESC`]],
      limit,
    });

    return comments.map((comment) => comment.get());
  }

  async drop(id) {
    const deletedRows = await this._Comment.destroy({
      where: {id}
    });

    return !!deletedRows;
  }
}

module.exports = CommentService;
