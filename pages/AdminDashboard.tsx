
import React from 'react';
import { useApp } from '../store/AppContext';
import { TrendingUp, ShoppingBag, DollarSign, ArrowUpRight, Package, Clock, Star, Settings as SettingsIcon, ChevronRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { OrderStatus } from '../types';
import { useNavigate } from 'react-router';

const AdminDashboard: React.FC = () => {
  const { orders, products, user, settings } = useApp();
  const navigate = useNavigate();

  const totalSales = orders
    .filter(o => o.status === OrderStatus.PAID)
    .reduce((acc, o) => acc + o.total, 0);

  const pendingOrders = orders.filter(o => o.status === OrderStatus.PENDING).length;
  const stockItems = products.reduce((acc, p) => acc + p.stock, 0);

  const chartData = [
    { name: 'S', value: 400 },
    { name: 'T', value: 300 },
    { name: 'Q', value: 600 },
    { name: 'Q', value: 800 },
    { name: 'S', value: 1200 },
    { name: 'S', value: 1500 },
    { name: 'D', value: 900 },
  ];

  return (
    <div className="p-6 space-y-8 pb-32">
      <header className="flex justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Olá, {user?.name.split(' ')[0]}!</h1>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">Painel de Controle</p>
        </div>
        <button 
          onClick={() => navigate('/admin/settings')}
          className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm text-slate-400 hover:text-slate-900 transition-colors"
        >
          <SettingsIcon size={20} />
        </button>
      </header>

      {/* Atalho para Configuração */}
      <button 
        onClick={() => navigate('/admin/settings')}
        className="w-full bg-gradient-to-r from-slate-900 to-slate-800 p-6 rounded-[2.5rem] text-white flex items-center justify-between shadow-xl shadow-slate-200 group"
      >
        <div className="flex items-center gap-4">
          <div className="bg-white/10 p-3 rounded-2xl group-hover:scale-110 transition-transform">
            <SettingsIcon size={24} className="text-blue-400" />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-sm">Configurações da Loja</h3>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Logo, Cores e Segurança</p>
          </div>
        </div>
        <ChevronRight size={20} className="text-slate-500" />
      </button>

      {/* Métricas Principais */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-3 relative overflow-hidden group hover:border-slate-900 transition-colors">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Vendas Totais</p>
            <p className="text-xl font-black text-slate-900">R$ {totalSales.toLocaleString()}</p>
          </div>
          <div className="absolute top-4 right-4 text-emerald-500"><ArrowUpRight size={20} /></div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-3 group hover:border-slate-900 transition-colors">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
            <ShoppingBag size={24} />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Pendentes</p>
            <p className="text-xl font-black text-slate-900">{pendingOrders} <span className="text-[10px] text-gray-400 font-medium">pedidos</span></p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-3">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
            <Package size={24} />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Itens em Estoque</p>
            <p className="text-xl font-black text-slate-900">{stockItems} <span className="text-[10px] text-gray-400 font-medium">un</span></p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-3">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Histórico</p>
            <p className="text-xl font-black text-slate-900">{orders.length}</p>
          </div>
        </div>
      </div>

      {/* Gráfico */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-8">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <TrendingUp size={16} className="text-blue-500" /> Faturamento
            </h3>
            <span className="text-[10px] font-bold text-emerald-500">+18.5%</span>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#cbd5e1', fontWeight: 700 }} />
              <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', fontSize: '12px' }} />
              <Bar dataKey="value" radius={[8, 8, 8, 8]} barSize={12}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 5 ? settings.primaryColor : '#f1f5f9'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
