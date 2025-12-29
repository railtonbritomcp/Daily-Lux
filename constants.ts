
import { Category, Product, Settings, User, UserRole } from './types';

export const INITIAL_SETTINGS: Settings = {
  storeName: "Daily Lux",
  logo: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=200&h=200&fit=crop",
  banner: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop",
  primaryColor: "#0f172a",
  backgroundColor: "#f9fafb",
  cardColor: "#ffffff",
  whatsappNumber: "5511999999999",
  pixKey: "suachavepix@exemplo.com",
  pixInstructions: "Após o pagamento, envie o comprovante para nosso WhatsApp para agilizar o envio do seu pedido.",
  enableNegotiation: true,
  maxInstallments: 12,
  enableFloatingWA: true,
  msgNegotiation: "Olá! Vi o produto {produto} por R$ {preco} na sua loja e gostaria de saber se conseguimos negociar o valor.",
  msgFeedback: "Olá! Gostaria de compartilhar minha experiência na {loja} com vocês."
};

export const MOCK_CATEGORIES: Category[] = [
  { id: '1', name: 'Lançamentos', order: 0 },
  { id: '2', name: 'Premium', order: 1 },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '101',
    name: 'Óculos de Sol Aviador',
    description: 'Proteção UV400 e design clássico atemporal. Feito com materiais de alta durabilidade e lentes polarizadas para máximo conforto visual.',
    price: 189.90,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop',
    categoryId: '1',
    active: true,
    order: 0,
    stock: 10
  }
];

export const MOCK_USERS: User[] = [
  { id: 'admin1', email: 'admin@zap.com', name: 'Administrador', role: UserRole.ADMIN },
  { id: 'client1', email: 'cliente@exemplo.com', name: 'João Silva', role: UserRole.CLIENT }
];

export const ADMIN_CREDENTIALS_DEFAULT = {
  email: 'admin@zap.com',
  password: '1234' 
};
