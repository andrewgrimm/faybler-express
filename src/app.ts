import express from 'express';
import http from 'http';
import path from 'path';
import bodyParser from 'body-parser';
import { getBook, postBook } from './controllers/booksController';
import ServerLogger from './loggers/ServerLogger';

const winstonLog = ServerLogger.getInstance();
const logger = winstonLog.getLogger();
const requestLogger = winstonLog.getRequestLogger();
const app = express();

app.use(bodyParser.json());
app.use(requestLogger);

app.post('/books', postBook);
app.get('/books/:id', getBook);
app.use('/', express.static(path.join(__dirname, '../client')));

const { PORT } = process.env;
const httpServer = http.createServer(app);
httpServer.listen(PORT, () => {
  logger.info(`Express.js server up and running on PORT: ${PORT}`);
});

export default httpServer;
