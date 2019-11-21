import winston from 'winston';
import { LoggingWinston } from '@google-cloud/logging-winston';
import { Request, Response } from 'express';
import httpContext from 'express-http-context';

export default class ServerLogger {
  private static instance: ServerLogger;

  private logger: winston.Logger;

  private requestLogger = (req: Request, res: Response, done: any) => {
    this.logger.info(this.addLogPrefix(req.originalUrl));
    done();
  }

  private constructor() {
    const loggingWinston = new LoggingWinston({
      projectId: process.env.PROJECT_ID,
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    });

    this.logger = winston.createLogger({
      level: 'info',
      transports: [
        new winston.transports.Console(),
        loggingWinston,
      ],
    });
  }

  public static getInstance(): ServerLogger {
    if (!ServerLogger.instance) {
      ServerLogger.instance = new ServerLogger();
    }
    return ServerLogger.instance;
  }

  public getRequestLogger(): (req: Request, res: Response, done: any) => void {
    return this.requestLogger;
  }

  private addLogPrefix = (message: string) => {
    const correlationID = httpContext.get('correlationID') || 'correlationID-error';
    const dateTime = new Date().toISOString().replace('T', ' ').substr(0, 19);
    return `${dateTime} ${correlationID} ${message}`;
  };

  public log(level: string, message: string): void {
    this.logger.log(level, this.addLogPrefix(message));
  }

  public error(message: string) {
    this.logger.error(this.addLogPrefix(message));
  }

  public warn(message: string) {
    this.logger.warn(this.addLogPrefix(message));
  }

  public verbose(message: string) {
    this.logger.verbose(this.addLogPrefix(message));
  }

  public info(message: string) {
    this.logger.info(this.addLogPrefix(message));
  }

  public debug(message: string) {
    this.logger.debug(this.addLogPrefix(message));
  }
}
