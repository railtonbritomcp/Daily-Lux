
import React from 'react';
import { useParams, useNavigate } from 'react-router';
import { useApp } from '../store/AppContext';
import { ArrowLeft, MessageCircle, Share2, CreditCard, QrCode, Sparkles } from 'lucide-react';

const ProductDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, settings } = useApp();
  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="p-8 text-center" style={{ backgroundColor: settings.backgroundColor }}>
        <p>Produto não encontrado.</p>
        <button onClick={() => navigate('/')} className="mt-4 underline" style={{ color: settings.primaryColor }}>Voltar</button>
      </div>
    );
  }

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`Olá! Tenho interesse no produto: ${product.name} (R$ ${product.price.toFixed(2)})`);
    window.open(`https://wa.me/${settings.whatsappNumber}?text=${text}`, '_blank');
  };

  const handleNegotiate = () => {
    const rawMsg = settings.msgNegotiation || "Olá! Gostaria de negociar o produto {produto}.";
    const processedMsg = rawMsg
      .replace('{produto}', product.name)
      .replace('{preco}', product.price.toFixed(2));
    const text = encodeURIComponent(processedMsg);
    window.open(`https://wa.me/${settings.whatsappNumber}?text=${text}`, '_blank');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Confira este produto: ${product.name}`,
        url: window.location.href,
      });
    }
  };

  const installmentValue = product.price / (settings.maxInstallments || 12);

  return (
    <div className="flex flex-col min-h-full" style={{ backgroundColor: settings.backgroundColor }}>
      <div className="relative h-96">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 z-10 bg-white/80 p-2 rounded-full shadow-md backdrop-blur-sm"
        >
          <ArrowLeft size={20} />
        </button>
        <button
          onClick={handleShare}
          className="absolute top-4 right-4 z-10 bg-white/80 p-2 rounded-full shadow-md backdrop-blur-sm"
        >
          <Share2 size={20} />
        </button>
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
      </div>

      <div className="px-6 py-8 space-y-6 -mt-8 relative bg-white rounded-t-[3rem] shadow-[0_-20px_40px_rgba(0,0,0,0.05)] flex-1" style={{ backgroundColor: settings.cardColor }}>
        <div className="space-y-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-gray-900 leading-tight">{product.name}</h1>
            <div className="flex items-center gap-2">
               <span className="text-2xl font-black" style={{ color: settings.primaryColor }}>
                R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
              {product.stock > 0 && (
                 <span className="bg-emerald-50 text-emerald-600 text-[9px] px-2 py-1 rounded-full font-bold uppercase tracking-wider">Em Estoque</span>
              )}
            </div>
          </div>

          {/* Formas de Pagamento */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-gray-50/50 p-3 rounded-2xl border border-gray-100 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white text-emerald-500 shadow-sm"><QrCode size={18} /></div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Pix</p>
                <p className="text-[10px] font-black text-emerald-600">Aprovação Imediata</p>
              </div>
            </div>
            <div className="bg-gray-50/50 p-3 rounded-2xl border border-gray-100 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white text-blue-500 shadow-sm"><CreditCard size={18} /></div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Cartão</p>
                <p className="text-[10px] font-black text-gray-700">{settings.maxInstallments}x R$ {installmentValue.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="prose prose-sm text-gray-500 leading-relaxed border-t border-gray-50 pt-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Sobre este item</p>
          <p>{product.description}</p>
        </div>

        <div className="pt-6 space-y-3">
          <button
            onClick={() => {
              addToCart(product);
              navigate('/cart');
            }}
            disabled={product.stock === 0}
            className="w-full text-white py-5 rounded-[2rem] font-bold text-lg shadow-2xl transition-all active:scale-95 disabled:opacity-30 disabled:grayscale"
            style={{ backgroundColor: settings.primaryColor }}
          >
            Adicionar ao Carrinho
          </button>
          
          <div className="flex gap-2">
            {settings.enableNegotiation && (
              <button
                onClick={handleNegotiate}
                className="flex-1 bg-white border-2 py-4 rounded-[1.8rem] font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
                style={{ borderColor: settings.primaryColor, color: settings.primaryColor }}
              >
                <Sparkles size={16} /> Negociar Valor
              </button>
            )}
            <button
              onClick={handleWhatsApp}
              className={`${settings.enableNegotiation ? 'flex-1' : 'w-full'} border-2 py-4 rounded-[1.8rem] font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95`}
              style={{ borderColor: '#25D366', color: '#25D366' }}
            >
              <MessageCircle size={18} /> Tirar Dúvidas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
