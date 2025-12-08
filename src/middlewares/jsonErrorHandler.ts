import { Request, Response, NextFunction } from "express";

export const jsonErrorHandler = (

  err: any,
  _req: Request,
  res: Response,
  next: NextFunction

) => {

  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({ message: "El JSON está mal formado" });    
  }

  next(err);
};
