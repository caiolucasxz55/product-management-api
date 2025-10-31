import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../types/user.types";


const mockUsers: (User & { password: string })[] = [
  { id: 1, username: "admin", role: "ADMIN", password: bcrypt.hashSync("admin123", 8) },
  { id: 2, username: "user1", role: "USER", password: bcrypt.hashSync("user123", 8) },
];


const JWT_SECRET = process.env.JWT_SECRET || "segredo123";


export const login = (req: Request, res: Response): Response => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username e senha são obrigatórios" });
  }


  const user = mockUsers.find(u => u.username === username);
  if (!user) {
    return res.status(401).json({ message: "Usuário ou senha incorretos" });
  }


  const passwordIsValid = bcrypt.compareSync(password, user.password);
  if (!passwordIsValid) {
    return res.status(401).json({ message: "Usuário ou senha incorretos" });
  }

 
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  
  return res.status(200).json({ token });
};
