'use strict';

const DEFAULT_COMMAND = `--help`;

const USER_ARGV_INDEX = 2;

const ExitCode = {
  error: 1,
  success: 0,
};

const MAX_ID_LENGTH = 6;

const API_PREFIX = `/api`;

const HttpCode = {
  OK: 200,
  CREATED: 201,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
  BAD_REQUEST: 400,
};

const Env = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`
};

const HttpMethod = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const DISPLAY_SETTINGS = {
  limitArticles: 8,
  limitAnnounce: 4,
  limitComment: 4,
};

module.exports = {
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  ExitCode,
  MAX_ID_LENGTH,
  API_PREFIX,
  HttpCode,
  Env,
  HttpMethod,
  DISPLAY_SETTINGS,
};
