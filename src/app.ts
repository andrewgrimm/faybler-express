import express from 'express';
import http from 'http';
import path from 'path';
import bodyParser from 'body-parser';
import httpContext from 'express-http-context';
import ServerLogger from './loggers/ServerLogger';
import correlationID from './loggers/correlationID';
import { getBooks, getBook, postBook } from './controllers/booksController';

const logger = ServerLogger.getInstance();
const requestLogger = logger.getRequestLogger();
const app = express();

app.use(bodyParser.json());
app.use(httpContext.middleware);
app.use(correlationID);
app.use(requestLogger);

app.get('/books', getBooks);
app.post('/books', postBook);
app.get('/books/:id', getBook);
app.use('/', express.static(path.join(__dirname, '..', 'client')));

const { PORT } = process.env;
const httpServer = http.createServer(app);
httpServer.listen(PORT, () => {
  logger.info(`Express.js server up and running on PORT: ${PORT}`);
});

export default httpServer;
