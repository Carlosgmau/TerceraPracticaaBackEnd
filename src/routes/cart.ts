import { Router } from "express";
import { ObjectId } from "mongodb";
import { getDB } from "../mongo";
import { authMiddleware } from "../middlewares/auth";
import { Cart, Product } from "../types";


export const cartRouter = Router();

cartRouter.put("/add", authMiddleware, async (req, res) => {

  try {
    const userId = new ObjectId((req as any).user.userId);
    const { productId, quantity } = req.body;

    if (!productId || typeof quantity !== "number") {
      return res.status(400).json({ message: "Faltan datos o vienen mal puestos." });
    }

    const db = getDB();
    const products = db.collection<Product>("products");
    const carts = db.collection<Cart>("carts");
    const product = await products.findOne({ _id: new ObjectId(productId) });


    if (!product) {
      return res.status(404).json({ message: "No se ha encontrado ese producto." });

    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: "No queda suficiente stock para añadir eso." });

    }

    const cart = await carts.findOne({ userId });


    if (!cart) {

      await carts.insertOne({
        userId,
        items: [{ productId: product._id!, quantity }]

      });


    } else {

      const item = cart.items.find(i => i.productId.equals(product._id!));

      if (item) {
        item.quantity += quantity;

      } else {

        cart.items.push({ productId: product._id!, quantity });
      }

      await carts.updateOne({ userId }, { $set: { items: cart.items } });
    }

    return res.status(200).json({ message: "Carrito actualizado sin problemas." });

  } catch {

    return res.status(500).json({ message: "No se pudo actualizar el carrito." });

  }
});

cartRouter.get("/", authMiddleware, async (req, res) => {

  try {
    const userId = new ObjectId((req as any).user.userId);
    const db = getDB();
    const carts = db.collection<Cart>("carts");

    const cart = await carts.findOne({ userId });

    return res.status(200).json(cart || { items: [] });

  } catch {

    return res.status(500).json({ message: "No se pudo obtener el carrito." });

  }
});
