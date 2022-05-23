'use strict';

const axios = require(`axios`);

const {HttpMethod} = require(`../constants`);
const TIMEOUT = 1000;
const port = process.env.API_PORT || 3000;
const defaultUrl = `http://localhost:${port}/api/`;

class API {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout
    });
  }

  async _load(url, options) {
    const response = await this._http.request({url, ...options});
    return response.data;
  }

  // Публикации
  getArticle(id) {
    return this._load(`/articles/${id}`);
  }

  getArticles({offset, limit, comments, categoryId} = {}) {
    return this._load(`/articles`, {params: {offset, limit, comments, categoryId}});
  }

  getHotArticles({limit} = {}) {
    return this._load(`/articles/hot_articles`, {params: {limit}});
  }

  createArticle(data) {
    return this._load(`/articles`, {
      method: HttpMethod.POST,
      data
    });
  }

  editArticle(id, data) {
    return this._load(`/articles/${id}`, {
      method: HttpMethod.PUT,
      data
    });
  }

  deleteArticle(id) {
    return this._load(`/articles/${id}`, {
      method: HttpMethod.DELETE,
    });
  }

  // Категории
  getCategory({id}) {
    return this._load(`/categories/${id}`);
  }

  getCategories({withCount} = {}) {
    return this._load(`/categories`, {params: {withCount}});
  }

  createCategory(name) {
    return this._load(`/categories/add`, {
      method: HttpMethod.POST,
      data: {name},
    });
  }

  updateCategory(id, name) {
    return this._load(`/categories/${id}`, {
      method: HttpMethod.PUT,
      data: {name},
    });
  }

  deleteCategory(id) {
    return this._load(`/categories/${id}`, {
      method: HttpMethod.DELETE,
    });
  }

  // Комментарии
  createComment(id, data, limit) {
    return this._load(`/articles/${id}/comments`, {
      method: HttpMethod.POST,
      data,
      params: {limit}
    });
  }

  getLastComments({limit} = {}) {
    return this._load(`/articles/last_comments`, {params: {limit}});
  }

  deleteComment({articleId, commentId, limitComment, limitAnnounce}) {
    return this._load(`/articles/${articleId}/comments/${commentId}`, {
      method: HttpMethod.DELETE,
      params: {limitComment, limitAnnounce}
    });
  }

  // Пользователь и авторизация
  createUser(data) {
    return this._load(`/user`, {
      method: HttpMethod.POST,
      data
    });
  }

  auth(email, password) {
    return this._load(`/user/auth`, {
      method: HttpMethod.POST,
      data: {email, password}
    });
  }

  // Поиск
  search(query) {
    return this._load(`/search`, {params: {query}});
  }
}

const defaultAPI = new API(defaultUrl, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};
