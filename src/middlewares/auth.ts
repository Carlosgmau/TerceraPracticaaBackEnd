import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";


export const authMiddleware = (

  req: Request,
  res: Response,
  next: NextFunction

) => {

  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "Necesitas mandar un token para seguir." });
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res
      .status(401)
      .json({ message: "El formato del token no es válido." });
  }

  const token = parts[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "No se encontró el token, revisa el header." });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET!);
    (req as any).user = decoded;
    next();

  } catch (error) {

    console.error("Error verificando token:", error);
    return res
      .status(401)
      .json({ message: "Tu token no es válido o ya caducó." });
  }
};
