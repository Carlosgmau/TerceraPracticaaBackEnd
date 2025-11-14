import { Request, Response, NextFunction } from "express";

export const errorHandler = (

  err: any,

  _req: Request,

  res: Response,

  _next: NextFunction

) => {

  console.error("Error interno:", err);

  if (err.status) {

    return res.status(err.status).json({

      message: err.message || "Ha ocurrido un problema."

    });

  }

  return res.status(500).json({

    message: "Algo ha pasafo en el servidor, prueba más tarde."
  });
};
