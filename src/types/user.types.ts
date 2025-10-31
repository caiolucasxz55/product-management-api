// src/types/user.types.ts
export interface User {
  id: number;
  username: string;
  password: string;
  role: "ADMIN" | "USER";  
  createdAt?: Date;
  updatedAt?: Date;
}