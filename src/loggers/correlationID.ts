import { Request, Response, NextFunction } from 'express';
import httpContext from 'express-http-context';
import { v4 } from 'uuid';

const correlationID = (req: Request, res: Response, next: NextFunction) => {
  httpContext.set('correlationID', v4());
  next();
};

export default correlationID;
