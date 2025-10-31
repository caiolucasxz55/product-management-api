// src/services/auth.service.ts
import { signJwt, comparePassword } from "../config/securityConfig";
import { User } from "../types/user.types";

// NOTE: o seu projeto atual define mockUsers em controllers; para manter isolado,
// aqui repetimos um mock local (substitua por DB mais tarde).
const mockUsers: (User & { password: string })[] = [
  { id: 1, username: "admin", role: "ADMIN", password: "admin123" }, // exemplo já hashed
  { id: 2, username: "user1", role: "USER", password: "user123" },
];

// Se no seu projeto os passwords não estão hashed, use securityConfig.hashPassword ao criar users.
// Para este serviço, vamos assumir que mockUsers tem senhas hashed.

export const AuthService = {
  /**
   * Verifica credenciais e retorna token JWT
   */
  login: async (username: string, password: string): Promise<{ token: string } | null> => {
    const user = mockUsers.find(u => u.username === username);
    if (!user) return null;

    const passwordOk = await comparePassword(password, user.password);
    if (!passwordOk) return null;

    const token = signJwt({ id: user.id, username: user.username, role: user.role });
    return { token };
  }
};
