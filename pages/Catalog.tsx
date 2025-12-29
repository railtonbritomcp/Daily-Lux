
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Share2, Plus, Search } from 'lucide-react';
import { Link } from 'react-router';

const Catalog: React.FC = () => {
  const { products, categories, settings, addToCart } = useApp();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategoryId === 'all' || p.categoryId === selectedCategoryId;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch && p.active;
  });

  const activeCategories = categories.sort((a, b) => a.order - b.order);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: settings.storeName,
        text: 'Confira nosso catálogo digital!',
        url: window.location.href,
      });
    }
  };

  return (
    <div className="pb-8">
      {/* Banner */}
      <div className="w-full h-44 overflow-hidden relative shadow-inner">
        <img src={settings.banner} alt="Banner" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <button 
            onClick={handleShare}
            className="bg-white/90 p-3 rounded-full text-gray-800 shadow-xl hover:scale-110 transition-transform"
          >
            <Share2 size={22} />
          </button>
        </div>
      </div>

      {/* Search & Categories */}
      <div className="px-4 py-6 space-y-5">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="O que você está procurando?"
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm shadow-sm focus:ring-2 outline-none transition-all"
            style={{ borderLeftColor: settings.primaryColor, borderLeftWidth: '4px' }}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setSelectedCategoryId('all')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${selectedCategoryId === 'all' ? 'text-white shadow-lg' : 'bg-white text-gray-500 border border-gray-100'}`}
            style={{ backgroundColor: selectedCategoryId === 'all' ? settings.primaryColor : undefined }}
          >
            Tudo
          </button>
          {activeCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryId(cat.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${selectedCategoryId === cat.id ? 'text-white shadow-lg' : 'bg-white text-gray-500 border border-gray-100'}`}
              style={{ backgroundColor: selectedCategoryId === cat.id ? settings.primaryColor : undefined }}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="px-4 grid grid-cols-2 gap-4">
        {filteredProducts.map(product => (
          <div 
            key={product.id} 
            className="rounded-[2rem] overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-xl border border-gray-100/50"
            style={{ backgroundColor: settings.cardColor }}
          >
            <Link to={`/product/${product.id}`} className="relative h-44 overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              {product.stock <= 2 && product.stock > 0 && (
                <div className="absolute top-2 left-2 bg-orange-500 text-white text-[8px] font-bold px-2 py-1 rounded-full uppercase">Últimas peças</div>
              )}
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
                   <span className="text-white font-bold text-[10px] uppercase tracking-widest border border-white/50 px-3 py-1 rounded-lg">Esgotado</span>
                </div>
              )}
            </Link>
            <div className="p-4 flex flex-col flex-1">
              <h3 className="text-xs font-bold text-gray-800 line-clamp-1 mb-1">{product.name}</h3>
              <p className="text-[10px] text-gray-400 line-clamp-2 leading-relaxed flex-1">{product.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm font-black" style={{ color: settings.primaryColor }}>
                  R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                <button
                  onClick={() => addToCart(product)}
                  disabled={product.stock === 0}
                  className="p-2.5 rounded-xl transition-all active:scale-95 disabled:opacity-30 disabled:grayscale"
                  style={{ backgroundColor: `${settings.primaryColor}10`, color: settings.primaryColor }}
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="px-4 py-20 text-center opacity-30">
          <Search size={40} className="mx-auto mb-4" />
          <p className="text-sm font-medium">Nenhum tesouro encontrado.</p>
        </div>
      )}
    </div>
  );
};

export default Catalog;
