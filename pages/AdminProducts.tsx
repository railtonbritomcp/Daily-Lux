
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Plus, Edit2, Trash2, Save, X, PackageOpen, AlertTriangle } from 'lucide-react';
import { Product } from '../types';

const AdminProducts: React.FC = () => {
  const { products, saveProduct, deleteProduct, categories } = useApp();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [isAdding, setIsAdding] = useState(false);

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData(product);
    setIsAdding(false);
  };

  const startAdd = () => {
    setIsAdding(true);
    setEditingId('new');
    setFormData({
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      description: '',
      price: 0,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
      categoryId: categories[0]?.id || '1',
      active: true,
      order: products.length,
      stock: 0
    });
  };

  const handleSave = () => {
    if (formData.name && formData.price !== undefined) {
      saveProduct(formData as Product);
      setEditingId(null);
      setIsAdding(false);
    }
  };

  return (
    <div className="p-6 space-y-6 pb-32">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Estoque & Itens</h1>
        <button
          onClick={startAdd}
          className="bg-blue-600 text-white px-4 py-2.5 rounded-2xl flex items-center gap-2 font-bold text-xs shadow-lg shadow-blue-100"
        >
          <Plus size={16} /> Adicionar Item
        </button>
      </div>

      {editingId && (
        <div className="bg-white border rounded-3xl p-6 shadow-2xl space-y-4 animate-in fade-in slide-in-from-top-4 duration-300 z-10 sticky top-20">
          <header className="flex justify-between items-center pb-2 border-b border-gray-50">
            <h2 className="font-bold text-slate-800 flex items-center gap-2 uppercase text-xs tracking-widest">
              <PackageOpen size={16} className="text-blue-500" /> {isAdding ? 'Novo Registro' : 'Editar Produto'}
            </h2>
            <button onClick={() => setEditingId(null)} className="text-gray-300 hover:text-gray-600"><X size={20}/></button>
          </header>
          
          <div className="space-y-3">
            <input
              placeholder="Nome do produto"
              className="w-full px-4 py-3 border border-gray-100 rounded-2xl bg-gray-50/30 text-sm outline-none"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
            <textarea
              placeholder="Descrição curta e atrativa"
              className="w-full px-4 py-3 border border-gray-100 rounded-2xl bg-gray-50/30 text-sm h-24 outline-none resize-none"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
            
            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Preço Sugerido (R$)</label>
                    <input
                        type="number"
                        className="w-full px-4 py-3 border border-gray-100 rounded-2xl bg-gray-50/30 text-sm font-bold text-blue-600 outline-none"
                        value={formData.price}
                        onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Quantidade em Estoque</label>
                    <input
                        type="number"
                        className="w-full px-4 py-3 border border-blue-100 rounded-2xl bg-blue-50/30 text-sm font-bold text-slate-900 outline-none"
                        value={formData.stock}
                        onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                    />
                </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Categoria</label>
              <select
                className="w-full px-4 py-3 border border-gray-100 rounded-2xl bg-gray-50/30 text-sm outline-none"
                value={formData.categoryId}
                onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} className="flex-1 bg-slate-900 text-white py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-slate-100">
              <Save size={18} /> Confirmar Dados
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {products.map(p => (
          <div key={p.id} className="bg-white p-4 rounded-3xl border border-gray-100 flex items-center gap-4 shadow-sm hover:border-blue-100 transition-all">
            <div className="relative shrink-0">
                <img src={p.image} className="w-20 h-20 rounded-2xl object-cover border border-gray-50 shadow-inner" />
                {p.stock <= 2 && (
                    <div className="absolute -top-2 -right-2 bg-orange-500 text-white p-1 rounded-full shadow-lg">
                        <AlertTriangle size={12} />
                    </div>
                )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm text-slate-800 truncate">{p.name}</h3>
              <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-blue-600 font-bold text-sm">R$ {p.price.toFixed(2)}</span>
                  <div className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold ${p.stock > 5 ? 'bg-emerald-50 text-emerald-600' : p.stock > 0 ? 'bg-orange-50 text-orange-600' : 'bg-red-50 text-red-600'}`}>
                      {p.stock} un.
                  </div>
              </div>
            </div>
            
            <div className="flex gap-1">
              <button 
                onClick={() => startEdit(p)}
                className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all"
              >
                <Edit2 size={20} />
              </button>
              <button 
                onClick={() => { if(window.confirm('Excluir este item permanentemente?')) deleteProduct(p.id) }}
                className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {products.length === 0 && (
          <div className="py-20 text-center space-y-4">
              <PackageOpen size={48} className="mx-auto text-gray-200" />
              <p className="text-gray-400 text-sm">Nenhum produto no catálogo.</p>
          </div>
      )}
    </div>
  );
};

export default AdminProducts;
