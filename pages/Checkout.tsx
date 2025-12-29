
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { CreditCard, QrCode, CheckCircle, Copy, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router';

const Checkout: React.FC = () => {
  const { cart, placeOrder, settings } = useApp();
  const [method, setMethod] = useState<'PIX' | 'CARD'>('PIX');
  const [step, setStep] = useState<'SELECT' | 'SUCCESS'>('SELECT');
  const [orderId, setOrderId] = useState('');
  const navigate = useNavigate();

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleFinish = () => {
    const order = placeOrder(method);
    setOrderId(order.id);
    setStep('SUCCESS');
  };

  const handleSendVoucher = () => {
    const text = encodeURIComponent(`Olá! Realizei o pagamento do pedido #${orderId} no valor de R$ ${total.toFixed(2)}. Segue o comprovante.`);
    window.open(`https://wa.me/${settings.whatsappNumber}?text=${text}`, '_blank');
  };

  if (step === 'SUCCESS') {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-[70vh] text-center" style={{ backgroundColor: settings.backgroundColor }}>
        <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-8 shadow-inner">
          <CheckCircle size={48} />
        </div>
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Pedido Recebido!</h2>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-3 mb-8">
          Código do Pedido: <span className="text-gray-900">#{orderId}</span>
        </p>
        
        {method === 'PIX' && (
          <div className="w-full p-8 rounded-[3rem] mb-8 space-y-6 shadow-sm" style={{ backgroundColor: settings.cardColor }}>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Pague via PIX</p>
            
            <div className="bg-white p-6 inline-block rounded-3xl border-4 border-gray-50 shadow-inner">
              <QrCode size={180} className="text-gray-800" />
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Chave:</p>
              <div className="bg-gray-50 p-4 rounded-2xl flex items-center justify-between gap-3 border border-dashed border-gray-200">
                <span className="text-xs font-mono font-bold truncate flex-1 text-left">{settings.pixKey}</span>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(settings.pixKey);
                    alert('Copiado!');
                  }}
                  className="p-2 bg-white rounded-xl shadow-sm text-gray-400"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>

            <p className="text-[11px] text-gray-500 font-medium leading-relaxed italic">
              {settings.pixInstructions}
            </p>

            <button 
              className="w-full flex items-center justify-center gap-2 text-white py-4 rounded-[2rem] font-bold transition-all active:scale-95 shadow-lg"
              style={{ backgroundColor: '#25D366' }}
              onClick={handleSendVoucher}
            >
              <MessageCircle size={18} /> Enviar Comprovante
            </button>
          </div>
        )}

        <button
          onClick={() => navigate('/')}
          className="w-full py-5 rounded-[2rem] font-bold text-gray-400 border-2 border-gray-100 hover:text-gray-800 transition-all"
        >
          Voltar ao Início
        </button>
      </div>
    );
  }

  return (
    <div className="px-6 py-10" style={{ backgroundColor: settings.backgroundColor }}>
      <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-8">Pagamento</h1>

      <div className="space-y-4 mb-10">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Escolha o método</p>
        
        <button
          onClick={() => setMethod('PIX')}
          className={`w-full p-6 rounded-[2rem] border-2 flex items-center gap-5 transition-all ${method === 'PIX' ? 'shadow-xl' : 'bg-white border-gray-50 shadow-sm opacity-60'}`}
          style={{ 
            borderColor: method === 'PIX' ? settings.primaryColor : undefined,
            backgroundColor: method === 'PIX' ? settings.cardColor : undefined
          }}
        >
          <div className={`p-4 rounded-2xl ${method === 'PIX' ? 'text-white shadow-lg' : 'bg-gray-100 text-gray-400'}`} style={{ backgroundColor: method === 'PIX' ? settings.primaryColor : undefined }}>
            <QrCode size={24} />
          </div>
          <div className="text-left">
            <p className="font-black text-gray-800">PIX</p>
            <p className="text-[10px] text-gray-400 font-bold uppercase">Aprovação em segundos</p>
          </div>
          {method === 'PIX' && <div className="ml-auto w-5 h-5 rounded-full ring-4 ring-white shadow-md" style={{ backgroundColor: settings.primaryColor }}></div>}
        </button>

        <button
          onClick={() => setMethod('CARD')}
          className={`w-full p-6 rounded-[2rem] border-2 flex items-center gap-5 transition-all ${method === 'CARD' ? 'shadow-xl' : 'bg-white border-gray-50 shadow-sm opacity-60'}`}
          style={{ 
            borderColor: method === 'CARD' ? settings.primaryColor : undefined,
            backgroundColor: method === 'CARD' ? settings.cardColor : undefined
          }}
        >
          <div className={`p-4 rounded-2xl ${method === 'CARD' ? 'text-white shadow-lg' : 'bg-gray-100 text-gray-400'}`} style={{ backgroundColor: method === 'CARD' ? settings.primaryColor : undefined }}>
            <CreditCard size={24} />
          </div>
          <div className="text-left">
            <p className="font-black text-gray-800">Cartão de Crédito</p>
            <p className="text-[10px] text-gray-400 font-bold uppercase">Parcelamento Premium</p>
          </div>
          {method === 'CARD' && <div className="ml-auto w-5 h-5 rounded-full ring-4 ring-white shadow-md" style={{ backgroundColor: settings.primaryColor }}></div>}
        </button>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] mb-10 shadow-sm border border-gray-50" style={{ backgroundColor: settings.cardColor }}>
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total do Investimento:</span>
          <span className="text-3xl font-black" style={{ color: settings.primaryColor }}>R$ {total.toFixed(2)}</span>
        </div>
        <p className="text-[9px] text-gray-300 font-medium text-center mt-4">Transação criptografada e segura via {settings.storeName}</p>
      </div>

      <button
        onClick={handleFinish}
        className="w-full text-white py-6 rounded-[2rem] font-bold text-lg shadow-2xl transition-all hover:brightness-110 active:scale-95"
        style={{ backgroundColor: settings.primaryColor }}
      >
        Confirmar Pagamento
      </button>
    </div>
  );
};

export default Checkout;
