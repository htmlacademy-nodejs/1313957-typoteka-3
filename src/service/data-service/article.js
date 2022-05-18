'use strict';

const Alias = require(`../models/alias`);
const {Sequelize} = require(`sequelize`);

class ArticleService {
  constructor(sequelize) {
    this._User = sequelize.models.User;
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
    this._ArticleCategory = sequelize.models.ArticleCategory;
  }

  async create(articleData) {
    const article = await this._Article.create(articleData);
    await article.addCategories(articleData.categories);
    return article.get();
  }

  async findOne(id) {
    const include = [Alias.CATEGORIES];
    include.push({
      model: this._Comment,
      as: Alias.COMMENTS,
      include: [
        {
          model: this._User,
          as: Alias.USERS,
          attributes: {
            exclude: [`passwordHash`]
          },
        }
      ],
      order: [[`createdAt`, `DESC`]],
    });

    return this._Article.findByPk(
        id,
        {
          include,
          order: [
            [{model: this._Comment, as: Alias.COMMENTS}, `createdAt`, `ASC`]
          ]
        });
  }

  async findAll(needComments) {
    const include = [Alias.CATEGORIES];
    if (needComments) {
      include.push({
        model: this._Comment,
        as: Alias.COMMENTS,
        include: [
          {
            model: this._User,
            as: Alias.USERS,
            attributes: {
              exclude: [`passwordHash`]
            }
          }
        ]
      });
    }

    const articles = await this._Article.findAll({
      include,
      order: [
        [`createdAt`, `DESC`],
        [`id`, `DESC`]
      ]
    });
    return articles.map((item) => item.get());
  }

  async findPage({limit, offset, categoryId}) {
    const include = [Alias.CATEGORIES, Alias.COMMENTS];
    if (categoryId) {
      include.push({
        model: this._ArticleCategory,
        as: Alias.ARTICLE_CATEGORIES,
        attributes: [],
        require: true,
        where: {
          categoryId,
        },
      });
    }

    const {count, rows} = await this._Article.findAndCountAll({
      limit,
      offset,
      include,
      order: [
        [`createdAt`, `DESC`],
        [`id`, `DESC`],
        [{model: this._Category, as: Alias.CATEGORIES}, `name`, `ASC`],
      ],
      distinct: true
    });
    return {count, articles: rows};
  }

  async findHotArticles(limit) {
    const articles = await this._Article.findAll({
      attributes: [
        `id`,
        `announce`,
        [Sequelize.fn(`COUNT`, Sequelize.col(`comments.id`)), `commentsCount`],
      ],
      include: [
        {
          model: this._Comment,
          as: Alias.COMMENTS,
          attributes: [],
        },
      ],
      group: [Sequelize.col(`Article.id`)],
      order: [[Sequelize.col(`commentsCount`), `DESC`]],
      having: Sequelize.where(
          Sequelize.fn(`COUNT`, Sequelize.col(`comments.id`)),
          {
            [Sequelize.Op.gt]: 0,
          },
      ),
      limit,
      subQuery: false,
    });

    return articles.map((article) => article.get());
  }

  async update(id, offer) {
    const [affectedRows] = await this._Article.update(offer, {
      where: {id}
    });

    return !!affectedRows;
  }

  async drop(id) {
    const deletedRows = await this._Article.destroy({
      where: {id}
    });
    return !!deletedRows;
  }
}

module.exports = ArticleService;
