import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma.js";
export async function login(req, res) {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user)
    return res.status(401).json({ message: "Usuário ou senha inválidos." });
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid)
    return res.status(401).json({ message: "Usuário ou senha inválidos." });
  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      poleId: user.poleId,
      city: user.city,
    },
    process.env.JWT_SECRET,
    { expiresIn: "12h" },
  );
  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      poleId: user.poleId,
      city: user.city,
    },
  });
}
export async function me(req, res) {
  res.json(req.user);
}
