// src/types/product.types.ts
export interface Product {
  id: number;
  name: string;
  price: number;
  description: string | null;  
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  userId: number | null;  
  user?: {
    id: number;
    username: string;
    role: "ADMIN" | "USER";  
  } | null;
}