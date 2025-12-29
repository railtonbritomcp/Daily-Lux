
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../store/AppContext';
import { MOCK_USERS } from '../constants';
import { LogIn, ArrowLeft, ShieldCheck, User as UserIcon, Lock, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
import { UserRole } from '../types';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  
  const { setUser, settings, adminCredentials, resetAdminCredentials } = useApp();
  const navigate = useNavigate();

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      if (email === adminCredentials.email && password === adminCredentials.password) {
        const adminUser = MOCK_USERS.find(u => u.role === UserRole.ADMIN) || {
            id: 'admin-main',
            email: adminCredentials.email,
            name: 'Administrador',
            role: UserRole.ADMIN
        };
        setUser(adminUser);
        navigate('/admin');
        return;
      }

      const clientUser = MOCK_USERS.find(u => u.email === email && u.role === UserRole.CLIENT);
      if (clientUser && password === 'cliente') {
        setUser(clientUser);
        navigate('/');
        return;
      }

      setError('Acesso negado. Verifique seu e-mail e senha.');
      setIsLoading(false);
    }, 800);
  };

  const handleReset = () => {
    resetAdminCredentials();
    setResetSuccess(true);
    setShowResetConfirm(false);
    setEmail('admin@zap.com');
    setPassword('1234');
    setTimeout(() => setResetSuccess(false), 4000);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-screen bg-white relative" style={{ backgroundColor: settings.backgroundColor }}>
      <button 
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 text-gray-400 hover:text-gray-800 flex items-center gap-1 text-sm font-medium transition-colors"
      >
        <ArrowLeft size={18} /> Voltar à Loja
      </button>

      <div className="mb-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="relative inline-block mb-4">
            <img src={settings.logo} alt="Logo" className="w-24 h-24 rounded-3xl mx-auto shadow-2xl object-cover border-4 border-white" />
            <div className="absolute -bottom-2 -right-2 bg-slate-900 text-white p-2 rounded-xl shadow-lg">
                <ShieldCheck size={16} />
            </div>
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">{settings.storeName}</h2>
        <p className="text-gray-400 text-xs mt-2 font-medium uppercase tracking-widest">Painel do Lojista</p>
      </div>

      <form onSubmit={handleLogin} className="w-full max-w-sm space-y-5 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 tracking-wider">E-mail Administrativo</label>
          <div className="relative group">
            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-slate-900 transition-colors" size={18} />
            <input
              type="email"
              className="w-full pl-12 pr-4 py-4 border border-gray-100 rounded-[1.5rem] bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-slate-100 outline-none transition-all text-sm font-medium"
              placeholder="seu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between items-center px-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Senha de Acesso</label>
            <button 
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="text-[10px] font-bold text-blue-500 hover:underline uppercase tracking-wider"
            >
              Esqueci a senha
            </button>
          </div>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-slate-900 transition-colors" size={18} />
            <input
              type="password"
              className="w-full pl-12 pr-4 py-4 border border-gray-100 rounded-[1.5rem] bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-slate-100 outline-none transition-all text-sm font-medium"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold flex items-center gap-2 animate-bounce">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {resetSuccess && (
          <div className="bg-emerald-50 text-emerald-600 p-4 rounded-2xl text-[10px] font-bold flex flex-col gap-1 border border-emerald-100 shadow-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} /> ACESSO RESTAURADO COM SUCESSO!
            </div>
            <p className="opacity-70">Sua senha agora é "1234" e o e-mail é "admin@zap.com".</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-bold text-sm flex items-center justify-center gap-3 hover:bg-black hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-slate-200 disabled:opacity-50"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <LogIn size={18} /> Acessar Dashboard
            </>
          )}
        </button>
      </form>

      {/* Modal de Confirmação de Reset */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xs p-8 rounded-[2.5rem] shadow-2xl space-y-6 text-center animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <RefreshCw size={28} />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-black text-slate-900">Recuperar Acesso?</h3>
              <p className="text-xs text-gray-500 leading-relaxed">Isso voltará sua senha para o padrão <span className="font-bold text-slate-900">"1234"</span>. Deseja continuar?</p>
            </div>
            <div className="space-y-3">
              <button 
                onClick={handleReset}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-xs shadow-lg shadow-blue-100 active:scale-95 transition-all"
              >
                Sim, Resetar Agora
              </button>
              <button 
                onClick={() => setShowResetConfirm(false)}
                className="w-full bg-gray-50 text-gray-400 py-4 rounded-2xl font-bold text-xs hover:text-gray-800 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-12 w-full max-w-sm">
        <div className="relative flex items-center justify-center mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
            <span className="relative bg-white px-4 text-[10px] font-bold text-gray-300 uppercase tracking-widest" style={{ backgroundColor: settings.backgroundColor }}>Acesso Rápido</span>
        </div>
        <div className="grid grid-cols-1 gap-3">
            <button 
                onClick={() => { setEmail('admin@zap.com'); setPassword('1234'); }}
                className="flex items-center justify-between px-5 py-4 bg-gray-50 hover:bg-slate-900 hover:text-white rounded-2xl transition-all group"
            >
                <div className="text-left">
                    <p className="text-[10px] font-black uppercase opacity-50 group-hover:opacity-100">Dono da Loja</p>
                    <p className="text-xs font-bold">Entrar como Administrador</p>
                </div>
                <ShieldCheck size={18} className="text-blue-500 group-hover:text-white" />
            </button>
        </div>
      </div>
      
      <p className="mt-8 text-[10px] text-gray-300 font-medium">Daily Lux Commerce v2.5 • White Label Solution</p>
    </div>
  );
};

export default Login;
