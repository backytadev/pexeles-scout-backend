import type { Request, Response, NextFunction } from 'express';

export const setDefaultQueryParams = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.query.per_page === undefined) {
    req.query.per_page = '10';
  }
  if (req.query.page === undefined) {
    req.query.page = '1';
  }
  next();
};
