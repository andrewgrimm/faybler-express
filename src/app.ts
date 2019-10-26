// Mixing commonjs and es6 modules ?????
import { getBook, postBook } from './controllers/booksController';

const express = require('express');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
const httpServer = http.createServer(app);
const { PORT } = process.env;

app.post('/books', postBook);
app.get('/books/:id', getBook);
app.use('/', express.static(path.join(__dirname, '../client')));

httpServer.listen(PORT, () => {
  /* eslint-disable no-console */
  console.log('Your node js server is running on PORT: ', PORT);
});

module.exports = app;
