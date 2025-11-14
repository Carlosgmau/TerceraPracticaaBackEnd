import { Router } from "express";

import { getDB } from "../mongo";

import { Product } from "../types";

import { authMiddleware } from "../middlewares/auth";



export const productsRouter = Router();

productsRouter.get("/", async (_req, res) => {

  try {

    const db = getDB();

    const products = db.collection<Product>("products");

    const allProducts = await products.find().toArray();

    res.status(200).json(allProducts);

  } catch {

    res.status(500).json({ message: "No se pudieron cargar los productos." });

  }

});

productsRouter.post("/", authMiddleware, async (req, res) => {

  try {

    const { name, description, price, stock } = req.body;


    if (!name || typeof price !== "number" || typeof stock !== "number") {

      return res.status(400).json({ message: "Datos del producto mal puestos." });


    }

    const db = getDB();

    const products = db.collection<Product>("products");



    const result = await products.insertOne({

      name,

      description,

      price,

      stock,

      createdAt: new Date(),

    });

    res.status(201).json({ message: "Producto creado.", productId: result.insertedId });

  } catch {

    res.status(500).json({ message: "No se pudo crear el producto." });

  }
});
