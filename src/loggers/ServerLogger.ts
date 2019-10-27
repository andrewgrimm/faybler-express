import winston from 'winston';
import { LoggingWinston } from '@google-cloud/logging-winston';
import { Request, Response } from 'express';

export default class ServerLogger {
  private static instance: ServerLogger;

  private logger: winston.Logger;

  private requestLogger = (req: Request, res: Response, done: any) => {
    this.logger.info(req.originalUrl);
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

  public getLogger(): any {
    return this.logger;
  }

  public getRequestLogger(): (req: Request, res: Response, done: any) => void {
    return this.requestLogger;
  }
}
