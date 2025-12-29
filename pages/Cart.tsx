
import React from 'react';
import { useApp } from '../store/AppContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router';

const Cart: React.FC = () => {
  const { cart, updateCartQuantity, removeFromCart, settings } = useApp();
  const navigate = useNavigate();

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-[60vh] text-center" style={{ backgroundColor: settings.backgroundColor }}>
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm mb-6">
          <ShoppingCart size={48} className="text-gray-200" />
        </div>
        <h2 className="text-xl font-black text-gray-800 tracking-tight">Seu carrinho está vazio</h2>
        <p className="text-gray-400 text-xs mt-2 mb-8 uppercase tracking-widest font-bold">Adicione produtos para continuar</p>
        <button
          onClick={() => navigate('/')}
          className="text-white px-10 py-4 rounded-[2rem] font-bold shadow-xl transition-all hover:scale-105 active:scale-95"
          style={{ backgroundColor: settings.primaryColor }}
        >
          Ver Catálogo
        </button>
      </div>
    );
  }

  return (
    <div className="px-6 py-8" style={{ backgroundColor: settings.backgroundColor }}>
      <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-8">Meu Carrinho</h1>
      
      <div className="space-y-4 mb-10">
        {cart.map(item => (
          <div key={item.id} className="flex gap-4 p-4 rounded-[2rem] shadow-sm border border-gray-100 transition-all hover:shadow-md" style={{ backgroundColor: settings.cardColor }}>
            <img src={item.image} alt={item.name} className="w-24 h-24 rounded-2xl object-cover" />
            <div className="flex-1 flex flex-col justify-between py-1">
              <div>
                <h3 className="font-bold text-sm text-gray-800 line-clamp-1">{item.name}</h3>
                <p className="font-black text-sm mt-1" style={{ color: settings.primaryColor }}>R$ {item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-xl">
                  <button onClick={() => updateCartQuantity(item.id, -1)} className="p-1 text-gray-400 hover:text-gray-800"><Minus size={14} /></button>
                  <span className="text-sm font-black min-w-[20px] text-center text-gray-800">{item.quantity}</span>
                  <button onClick={() => updateCartQuantity(item.id, 1)} className="p-1 text-gray-400 hover:text-gray-800"><Plus size={14} /></button>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 p-2 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm space-y-4" style={{ backgroundColor: settings.cardColor }}>
        <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          <span>Subtotal</span>
          <span className="text-gray-900">R$ {total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          <span>Frete Estimado</span>
          <span className="text-emerald-500">Grátis</span>
        </div>
        <div className="h-px bg-gray-50"></div>
        <div className="flex justify-between items-center pt-2">
          <span className="font-black text-lg text-gray-900">Total</span>
          <span className="font-black text-2xl" style={{ color: settings.primaryColor }}>R$ {total.toFixed(2)}</span>
        </div>
      </div>

      <button
        onClick={() => navigate('/checkout')}
        className="w-full text-white py-5 rounded-[2.5rem] font-bold text-lg mt-8 flex items-center justify-center gap-3 shadow-2xl transition-all hover:brightness-110 active:scale-95"
        style={{ backgroundColor: settings.primaryColor }}
      >
        Finalizar Pedido <ArrowRight size={20} />
      </button>
    </div>
  );
};

export default Cart;
