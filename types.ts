
export enum UserRole {
  ADMIN = 'ADMIN',
  CLIENT = 'CLIENT'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED'
}

export interface Category {
  id: string;
  name: string;
  order: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
  active: boolean;
  order: number;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  clientId: string;
  clientName: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  paymentMethod: 'PIX' | 'CARD';
}

export interface Settings {
  storeName: string;
  logo: string;
  banner: string;
  primaryColor: string;
  backgroundColor: string;
  cardColor: string;
  whatsappNumber: string;
  pixKey: string;
  pixInstructions: string;
  enableNegotiation: boolean;
  maxInstallments: number;
  enableFloatingWA: boolean;
  msgNegotiation: string;
  msgFeedback: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}
