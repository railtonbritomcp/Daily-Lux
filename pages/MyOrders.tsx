
import React from 'react';
import { useApp } from '../store/AppContext';
import { Package, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { OrderStatus } from '../types';

const MyOrders: React.FC = () => {
  const { orders, user, settings } = useApp();
  const myOrders = orders.filter(o => o.clientId === user?.id);

  const getStatusInfo = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING: return { label: 'Pendente', color: 'text-orange-600 bg-orange-50', icon: <Clock size={14} /> };
      case OrderStatus.PAID: return { label: 'Pago', color: 'text-green-600 bg-green-50', icon: <CheckCircle2 size={14} /> };
      case OrderStatus.CANCELLED: return { label: 'Cancelado', color: 'text-red-600 bg-red-50', icon: <XCircle size={14} /> };
    }
  };

  return (
    <div className="px-6 py-8 min-h-full" style={{ backgroundColor: settings.backgroundColor }}>
      <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-8">Meus Pedidos</h1>

      {myOrders.length === 0 ? (
        <div className="text-center py-20 opacity-30">
          <Package size={60} className="mx-auto mb-4" />
          <p className="text-sm font-bold uppercase tracking-widest">Nenhuma história ainda.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {myOrders.map(order => {
            const status = getStatusInfo(order.status);
            return (
              <div key={order.id} className="rounded-[2.5rem] p-6 shadow-sm border border-gray-100 space-y-4 transition-all hover:shadow-md" style={{ backgroundColor: settings.cardColor }}>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Cod: {order.id}</span>
                  <div className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${status.color}`}>
                    {status.icon} {status.label}
                  </div>
                </div>
                
                <div className="space-y-2 py-2">
                  {order.items.map(item => (
                    <div key={item.id} className="flex justify-between text-xs">
                      <span className="text-gray-500 font-medium">{item.quantity}x {item.name}</span>
                      <span className="font-black text-gray-800">R$ {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-gray-50 flex justify-between items-end">
                  <div className="text-left">
                    <p className="text-[8px] font-bold text-gray-300 uppercase tracking-widest">Realizado em</p>
                    <p className="text-[10px] font-bold text-gray-800">{new Date(order.createdAt).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] font-bold text-gray-300 uppercase tracking-widest">Total</p>
                    <p className="text-xl font-black" style={{ color: settings.primaryColor }}>R$ {order.total.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
