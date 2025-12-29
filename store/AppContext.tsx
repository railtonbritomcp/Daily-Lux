
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Category, Settings, User, CartItem, Order, UserRole, OrderStatus } from '../types';
import { MOCK_PRODUCTS, MOCK_CATEGORIES, INITIAL_SETTINGS, MOCK_USERS, ADMIN_CREDENTIALS_DEFAULT } from '../constants';

interface AppContextType {
  products: Product[];
  categories: Category[];
  settings: Settings;
  user: User | null;
  cart: CartItem[];
  orders: Order[];
  adminCredentials: typeof ADMIN_CREDENTIALS_DEFAULT;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  saveProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  saveCategory: (category: Category) => void;
  deleteCategory: (categoryId: string) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  placeOrder: (paymentMethod: 'PIX' | 'CARD') => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateAdminCredentials: (creds: typeof ADMIN_CREDENTIALS_DEFAULT) => void;
  resetAdminCredentials: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('zap_products');
    return saved ? JSON.parse(saved) : MOCK_PRODUCTS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('zap_categories');
    return saved ? JSON.parse(saved) : MOCK_CATEGORIES;
  });

  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('zap_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('zap_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [adminCredentials, setAdminCredentials] = useState(() => {
    const saved = localStorage.getItem('zap_admin_creds');
    return saved ? JSON.parse(saved) : ADMIN_CREDENTIALS_DEFAULT;
  });

  const [cart, setCart] = useState<CartItem[]>([]);

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('zap_orders');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('zap_products', JSON.stringify(products));
    localStorage.setItem('zap_categories', JSON.stringify(categories));
    localStorage.setItem('zap_settings', JSON.stringify(settings));
    localStorage.setItem('zap_user', JSON.stringify(user));
    localStorage.setItem('zap_orders', JSON.stringify(orders));
    localStorage.setItem('zap_admin_creds', JSON.stringify(adminCredentials));
  }, [products, categories, settings, user, orders, adminCredentials]);

  const updateAdminCredentials = (creds: typeof ADMIN_CREDENTIALS_DEFAULT) => {
    setAdminCredentials(creds);
  };

  const resetAdminCredentials = () => {
    setAdminCredentials(ADMIN_CREDENTIALS_DEFAULT);
    localStorage.removeItem('zap_admin_creds');
  };

  const saveProduct = (product: Product) => {
    setProducts(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) return prev.map(p => p.id === product.id ? product : p);
      return [...prev, product];
    });
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const saveCategory = (category: Category) => {
    setCategories(prev => {
      const exists = prev.find(c => c.id === category.id);
      if (exists) return prev.map(c => c.id === category.id ? category : c);
      return [...prev, category];
    });
  };

  const deleteCategory = (categoryId: string) => {
    setCategories(prev => prev.filter(c => c.id !== categoryId));
  };

  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      alert("Desculpe, este produto está temporariamente esgotado.");
      return;
    }
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          alert("Limite de estoque atingido para este item.");
          return prev;
        }
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const prod = products.find(p => p.id === productId);
        const newQty = Math.max(1, item.quantity + delta);
        if (prod && newQty > prod.stock) {
          alert("Limite de estoque atingido.");
          return item;
        }
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  const placeOrder = (paymentMethod: 'PIX' | 'CARD') => {
    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 6).toUpperCase(),
      clientId: user?.id || 'guest',
      clientName: user?.name || 'Visitante',
      items: [...cart],
      total,
      status: OrderStatus.PENDING,
      createdAt: new Date().toISOString(),
      paymentMethod
    };

    setProducts(prev => prev.map(p => {
        const itemInCart = cart.find(ci => ci.id === p.id);
        if (itemInCart) {
            return { ...p, stock: Math.max(0, p.stock - itemInCart.quantity) };
        }
        return p;
    }));

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  return (
    <AppContext.Provider value={{
      products, categories, settings, user, cart, orders, adminCredentials,
      setProducts, setCategories, setSettings, setUser,
      saveProduct, deleteProduct, saveCategory, deleteCategory,
      addToCart, removeFromCart, updateCartQuantity, clearCart,
      placeOrder, updateOrderStatus, updateAdminCredentials, resetAdminCredentials
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
