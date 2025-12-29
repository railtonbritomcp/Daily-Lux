
import React, { useState, useRef } from 'react';
import { useApp } from '../store/AppContext';
import { Save, Image as ImageIcon, Palette, Phone, ShieldCheck, Lock, Mail, Eye, EyeOff, CheckCircle2, Upload, ShoppingBag, Sparkles, MessageCircle, QrCode } from 'lucide-react';

const AdminSettings: React.FC = () => {
  const { settings, setSettings, adminCredentials, updateAdminCredentials } = useApp();
  const [localSettings, setLocalSettings] = useState(settings);
  const [localCreds, setLocalCreds] = useState(adminCredentials);
  const [showPassword, setShowPassword] = useState(false);
  const [savedStatus, setSavedStatus] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const handleSaveAll = () => {
    setSettings(localSettings);
    updateAdminCredentials(localCreds);
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 3000);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'logo' | 'banner') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalSettings(prev => ({ ...prev, [target]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-6 space-y-8 pb-32 max-w-md mx-auto">
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Configurações</h1>
          <p className="text-xs text-gray-400">Personalize a alma da sua loja digital.</p>
        </div>
        {savedStatus && (
          <div className="bg-green-100 text-green-600 p-2 rounded-full animate-bounce border border-green-200 shadow-sm">
            <CheckCircle2 size={20} />
          </div>
        )}
      </header>

      <section className="space-y-6">
        
        {/* CONFIGURAÇÃO DE WHATSAPP E MENSAGENS */}
        <div className="bg-white rounded-[2.5rem] p-8 border shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <MessageCircle size={16} className="text-emerald-500" /> Comunicação & Templates
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">WhatsApp de Vendas</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                <input 
                  type="text" 
                  className="w-full pl-10 pr-4 py-3 border border-gray-100 rounded-2xl bg-gray-50 text-sm outline-none font-bold"
                  value={localSettings.whatsappNumber}
                  onChange={e => setLocalSettings({...localSettings, whatsappNumber: e.target.value})}
                  placeholder="Ex: 5511999999999"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase ml-1 flex justify-between">
                <span>Template: Negociação</span>
                <span className="text-blue-500 lowercase">{'{produto}, {preco}'}</span>
              </label>
              <textarea 
                className="w-full px-4 py-3 border border-gray-100 rounded-2xl bg-gray-50 text-sm outline-none h-24 resize-none leading-relaxed"
                value={localSettings.msgNegotiation}
                onChange={e => setLocalSettings({...localSettings, msgNegotiation: e.target.value})}
                placeholder="Ex: Olá! Vi o {produto} por R$ {preco}..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase ml-1 flex justify-between">
                <span>Template: Feedback Global</span>
                <span className="text-blue-500 lowercase">{'{loja}'}</span>
              </label>
              <textarea 
                className="w-full px-4 py-3 border border-gray-100 rounded-2xl bg-gray-50 text-sm outline-none h-24 resize-none leading-relaxed"
                value={localSettings.msgFeedback}
                onChange={e => setLocalSettings({...localSettings, msgFeedback: e.target.value})}
                placeholder="Ex: Adorei comprar na {loja}!"
              />
            </div>
          </div>
        </div>

        {/* CONFIGURAÇÃO DE PAGAMENTO (PIX) */}
        <div className="bg-white rounded-[2.5rem] p-8 border shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <QrCode size={16} className="text-blue-500" /> Configuração do PIX
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Chave PIX</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 border border-gray-100 rounded-2xl bg-gray-50 text-sm font-black outline-none"
                value={localSettings.pixKey}
                onChange={e => setLocalSettings({...localSettings, pixKey: e.target.value})}
                placeholder="CPF, CNPJ, E-mail ou Chave Aleatória"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Instruções de Pagamento</label>
              <textarea 
                className="w-full px-4 py-3 border border-gray-100 rounded-2xl bg-gray-50 text-sm outline-none h-20 resize-none leading-relaxed"
                value={localSettings.pixInstructions}
                onChange={e => setLocalSettings({...localSettings, pixInstructions: e.target.value})}
                placeholder="Ex: Envie o comprovante via WhatsApp..."
              />
            </div>
          </div>
        </div>

        {/* REGRAS E VISUAL */}
        <div className="bg-white rounded-[2.5rem] p-8 border shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <ShoppingBag size={16} className="text-orange-500" /> Interface & Regras
          </div>

          <div className="space-y-5">
             <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div>
                    <p className="text-xs font-bold text-slate-900 flex items-center gap-2"><Sparkles size={14} className="text-blue-500" /> Botão de Negociação</p>
                    <p className="text-[10px] text-gray-400">Ativar propostas no WhatsApp</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" 
                        checked={localSettings.enableNegotiation}
                        onChange={e => setLocalSettings({...localSettings, enableNegotiation: e.target.checked})}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div>
                    <p className="text-xs font-bold text-slate-900 flex items-center gap-2"><MessageCircle size={14} className="text-emerald-500" /> WhatsApp Flutuante</p>
                    <p className="text-[10px] text-gray-400">Feedback e suporte rápido</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" 
                        checked={localSettings.enableFloatingWA}
                        onChange={e => setLocalSettings({...localSettings, enableFloatingWA: e.target.checked})}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Cor Principal</label>
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                <input 
                  type="color" 
                  className="w-10 h-10 rounded-lg cursor-pointer border-2 border-white shadow-sm"
                  value={localSettings.primaryColor}
                  onChange={e => setLocalSettings({...localSettings, primaryColor: e.target.value})}
                />
                <input 
                  type="text"
                  className="flex-1 bg-transparent text-sm font-mono outline-none uppercase"
                  value={localSettings.primaryColor}
                  onChange={e => setLocalSettings({...localSettings, primaryColor: e.target.value})}
                />
              </div>
            </div>
          </div>
        </div>

        {/* LOGO E BANNER */}
        <div className="bg-white rounded-[2.5rem] p-8 border shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <ImageIcon size={16} className="text-blue-500" /> Identidade Visual
          </div>

          <div className="space-y-6">
            <div className="space-y-3 text-center">
              <div className="relative inline-block group">
                <img src={localSettings.logo} className="w-24 h-24 rounded-full object-cover border-4 border-gray-50 shadow-md" />
                <button 
                  onClick={() => logoInputRef.current?.click()}
                  className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-full"
                >
                  <Upload size={24} />
                </button>
              </div>
              <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, 'logo')} />
            </div>

            <div className="space-y-3">
              <div className="relative group h-32 w-full rounded-3xl overflow-hidden border-2 border-gray-50 shadow-sm">
                <img src={localSettings.banner} className="w-full h-full object-cover" />
                <button 
                  onClick={() => bannerInputRef.current?.click()}
                  className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <div className="bg-black/50 p-3 rounded-full backdrop-blur-sm"><Upload size={20} /></div>
                </button>
              </div>
              <input ref={bannerInputRef} type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, 'banner')} />
            </div>
          </div>
        </div>

        {/* SEGURANÇA */}
        <div className="bg-white rounded-[2.5rem] p-8 border shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <ShieldCheck size={16} className="text-red-500" /> Acesso ao Dashboard
          </div>
          
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">E-mail Administrativo</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                <input 
                  type="email" 
                  className="w-full pl-10 pr-4 py-3 border border-gray-100 rounded-2xl bg-gray-50 text-sm outline-none"
                  value={localCreds.email}
                  onChange={e => setLocalCreds({...localCreds, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Senha Mestra</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="w-full pl-10 pr-10 py-3 border border-gray-100 rounded-2xl bg-gray-50 text-sm outline-none font-mono"
                  value={localCreds.password}
                  onChange={e => setLocalCreds({...localCreds, password: e.target.value})}
                />
                <button 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-md px-6 z-[60]">
        <button
          onClick={handleSaveAll}
          className="w-full bg-slate-900 text-white py-5 rounded-[2.2rem] font-bold flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(0,0,0,0.2)] hover:scale-[1.02] active:scale-95 transition-all"
        >
          <Save size={20} /> Salvar Tudo
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;
