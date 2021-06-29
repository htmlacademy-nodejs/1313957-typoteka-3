'use strict';

const express = require(`express`);

const myRoutes = require('./routes/my-routes');
const mainRoutes = require('./routes/main-routes');
const articlesRoutes = require('./routes/articles-routes');

const DEFAULT_PORT = 8080;

const app = express();

app.use(`/`, mainRoutes);
app.use(`/my`, myRoutes);
app.use(`/articles`, articlesRoutes);

app.listen(DEFAULT_PORT);
