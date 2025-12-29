
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Plus, Edit2, Trash2, Save, X, List } from 'lucide-react';
import { Category } from '../types';

const AdminCategories: React.FC = () => {
  const { categories, saveCategory, deleteCategory, products } = useApp();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Category>>({});
  const [isAdding, setIsAdding] = useState(false);

  const startEdit = (category: Category) => {
    setEditingId(category.id);
    setFormData(category);
    setIsAdding(false);
  };

  const startAdd = () => {
    setIsAdding(true);
    setEditingId('new');
    setFormData({
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      order: categories.length
    });
  };

  const handleSave = () => {
    if (formData.name) {
      saveCategory(formData as Category);
      setEditingId(null);
      setIsAdding(false);
    }
  };

  const handleDelete = (id: string) => {
    const productsInCat = products.filter(p => p.categoryId === id);
    if (productsInCat.length > 0) {
      alert(`Não é possível excluir esta categoria pois existem ${productsInCat.length} produtos vinculados a ela.`);
      return;
    }

    if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      deleteCategory(id);
    }
  };

  return (
    <div className="p-6 space-y-6 pb-24">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Categorias</h1>
        <button
          onClick={startAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-sm shadow-md"
        >
          <Plus size={18} /> Nova Categoria
        </button>
      </div>

      <div className="space-y-4">
        {editingId && (
          <div className="bg-white border-2 border-blue-500 rounded-2xl p-4 shadow-xl space-y-4 animate-in fade-in zoom-in duration-300">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <List size={16} /> {isAdding ? 'Nova Categoria' : 'Editar Categoria'}
            </h2>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase">Nome da Categoria</label>
                <input
                  type="text"
                  placeholder="Ex: Moda Praia"
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase">Ordem de Exibição</label>
                <input
                  type="number"
                  placeholder="Ordem (0, 1, 2...)"
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  value={formData.order}
                  onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleSave} className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2">
                <Save size={16} /> Salvar
              </button>
              <button onClick={() => setEditingId(null)} className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2">
                <X size={16} /> Cancelar
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {categories.sort((a,b) => a.order - b.order).map(cat => (
            <div key={cat.id} className="bg-white p-4 rounded-2xl border flex items-center gap-4 shadow-sm">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 font-bold">
                {cat.order}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-sm">{cat.name}</h3>
                <p className="text-[10px] text-gray-400">
                  {products.filter(p => p.categoryId === cat.id).length} produtos vinculados
                </p>
              </div>
              <div className="flex gap-1">
                <button 
                  onClick={() => startEdit(cat)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(cat.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminCategories;
