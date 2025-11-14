import { Router } from "express";
import { getDB } from "../mongo";
import { User } from "../types";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";



export const authRouter = Router();

authRouter.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Faltan datos, revisa tu JSON." });
    }

    const db = getDB();
    const users = db.collection<User>("users");

    const existingUser = await users.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({ message: "Ese usuario o email ya existe." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await users.insertOne({ username, email, passwordHash, createdAt: new Date() });

    res.status(201).json({ message: "Usuario registrado sin problemas." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "No se pudo registrar el usuario." });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Faltan datos, revisa tu JSON." });
    }

    const db = getDB();
    const users = db.collection<User>("users");

    const user = await users.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email o contraseña incorrectos." });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Email o contraseña incorrectos." });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET!, {
      expiresIn: "1h",
    });

    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "No se pudo iniciar sesión." });
  }
});
