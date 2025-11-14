import "dotenv/config";

import express, { Request, Response, NextFunction } from "express";

import { connectToMongoDB } from "./mongo";

import { authRouter } from "./routes/auth";

import { productsRouter } from "./routes/products";

import { cartRouter } from "./routes/cart";



const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use((err: any, _req: Request, res: Response, next: NextFunction) => {

  if (err instanceof SyntaxError && "body" in err) {

    return res.status(400).json({ message: "El JSON está mal escrito, revísalo." });

  }

  next();

});

app.use("/api/auth", authRouter);

app.use("/api/products", productsRouter);

app.use("/api/cart", cartRouter);

app.use("*", (_req: Request, res: Response) => {

  res.status(404).json({ message: "Esta ruta no existe." });

});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {

  console.error(err);

  res.status(500).json({ message: "Algo se ha roto en el servidor." });

});

const start = async () => {

  try {

    await connectToMongoDB();

    app.listen(PORT, () =>

      console.log(`Servidor funcionando en el puerto ${PORT}`)

    );
  } catch (err) {

    console.error("No se pudo iniciar el servidor:", err);

    process.exit(1);

  }
};

start();
