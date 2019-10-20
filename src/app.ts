// Mixing commonjs and es6 modules ?????
import { Request, Response } from 'express';
import { request } from 'http';
const express = require('express');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
const httpServer = http.createServer(app);
const PORT = process.env.PORT;

app.use('/', express.static(path.join(__dirname, '../client')));

// 404 page
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({ Titile: 'Page not found' });
});

httpServer.listen(PORT, () => {
  console.log('Your node js server is running on PORT: ', PORT);
});

module.exports = app;
