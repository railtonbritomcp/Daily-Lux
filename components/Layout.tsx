
import React from 'react';
import { useApp } from '../store/AppContext';
import { UserRole } from '../types';
import { ShoppingBag, User as UserIcon, LayoutDashboard, Settings as SettingsIcon, LogOut, Package, LogIn, Boxes, List, MessageCircle } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, setUser, settings, cart } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  const handleFeedback = () => {
    const rawMsg = settings.msgFeedback || "Olá! Gostaria de enviar um feedback.";
    const processedMsg = rawMsg.replace('{loja}', settings.storeName);
    const text = encodeURIComponent(processedMsg);
    window.open(`https://wa.me/${settings.whatsappNumber}?text=${text}`, '_blank');
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const isActive = (path: string) => location.pathname === path;
  const isAdmin = user?.role === UserRole.ADMIN;

  return (
    <div 
      className="min-h-screen flex flex-col max-w-md mx-auto shadow-xl relative overflow-x-hidden transition-colors duration-500"
      style={{ backgroundColor: settings.backgroundColor }}
    >
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={settings.logo} alt="Logo" className="w-8 h-8 rounded-full object-cover" />
          <h1 className="font-bold text-lg text-gray-800">{settings.storeName}</h1>
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors">
              <LogOut size={20} />
            </button>
          ) : (
            <Link to="/login" className="text-gray-400 hover:text-blue-600 transition-colors">
              <UserIcon size={20} />
            </Link>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-24 overflow-y-auto">
        {children}
      </main>

      {/* Botão Flutuante de WhatsApp (Feedback/Suporte) */}
      {settings.enableFloatingWA && !isAdmin && (
        <button
          onClick={handleFeedback}
          className="fixed bottom-24 right-6 z-50 p-4 rounded-full shadow-2xl transition-all hover:scale-110 active:scale-90 flex items-center justify-center animate-bounce"
          style={{ backgroundColor: '#25D366', color: 'white' }}
        >
          <MessageCircle size={28} />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </span>
        </button>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t px-4 py-3 flex justify-between items-center z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <Link to="/" className={`flex flex-col items-center gap-1 ${isActive('/') ? 'text-blue-600' : 'text-gray-400'}`} style={{ color: isActive('/') ? settings.primaryColor : undefined }}>
          <ShoppingBag size={22} />
          <span className="text-[10px] font-medium text-center">Início</span>
        </Link>

        {user?.role === UserRole.CLIENT && (
          <Link to="/my-orders" className={`flex flex-col items-center gap-1 ${isActive('/my-orders') ? 'text-blue-600' : 'text-gray-400'}`}>
            <Package size={22} />
            <span className="text-[10px] font-medium text-center">Pedidos</span>
          </Link>
        )}

        {isAdmin && (
          <>
            <Link to="/admin" className={`flex flex-col items-center gap-1 ${isActive('/admin') ? 'text-blue-600' : 'text-gray-400'}`}>
              <LayoutDashboard size={22} />
              <span className="text-[10px] font-medium text-center">Painel</span>
            </Link>
            <Link to="/admin/products" className={`flex flex-col items-center gap-1 ${isActive('/admin/products') ? 'text-blue-600' : 'text-gray-400'}`}>
              <Boxes size={22} />
              <span className="text-[10px] font-medium text-center">Itens</span>
            </Link>
            <Link to="/admin/categories" className={`flex flex-col items-center gap-1 ${isActive('/admin/categories') ? 'text-blue-600' : 'text-gray-400'}`}>
              <List size={22} />
              <span className="text-[10px] font-medium text-center">Cats</span>
            </Link>
            <Link to="/admin/settings" className={`flex flex-col items-center gap-1 ${isActive('/admin/settings') ? 'text-blue-600' : 'text-gray-400'}`}>
              <SettingsIcon size={22} />
              <span className="text-[10px] font-medium text-center">Ajustes</span>
            </Link>
          </>
        )}

        {!user && (
          <Link to="/login" className={`flex flex-col items-center gap-1 ${isActive('/login') ? 'text-blue-600' : 'text-gray-400'}`}>
            <LogIn size={22} />
            <span className="text-[10px] font-medium text-center">Login</span>
          </Link>
        )}

        <Link to="/cart" className={`relative flex flex-col items-center gap-1 ${isActive('/cart') ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className="relative">
            <ShoppingBag size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium text-center">Carrinho</span>
        </Link>
      </nav>
    </div>
  );
};

export default Layout;
