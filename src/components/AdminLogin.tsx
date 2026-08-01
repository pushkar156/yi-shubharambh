import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { ShieldAlert, Lock, User, ArrowLeft } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onCancel: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onCancel }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Read configured env variables or fall back to default values
    const expectedUsername = import.meta.env.VITE_ADMIN_USERNAME || 'admin';
    const expectedPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'yi_mitwpu_2026';

    if (username === expectedUsername && password === expectedPassword) {
      onLoginSuccess();
    } else {
      setError('Invalid username or password. Please try again!');
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-[#141414] flex flex-col justify-between p-4 sm:p-6 font-sans selection:bg-[#FF6633] selection:text-white">
      {/* Top Header */}
      <header className="flex items-center justify-between pb-3 border-b-4 border-[#141414]">
        <BrandLogo size="sm" lightMode={true} />
        <button
          onClick={onCancel}
          className="text-xs font-black uppercase text-[#141414] bg-white px-2 py-1 border-2 border-[#141414] shadow-[2px_2px_0px_0px_#141414] hover:bg-[#FF6633] hover:text-white transition flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit Admin</span>
        </button>
      </header>

      {/* Login Card */}
      <main className="my-auto py-6 flex flex-col items-center max-w-md mx-auto w-full bg-white border-4 border-[#141414] p-6 shadow-[10px_10px_0px_0px_#141414] space-y-6">
        {/* Admin Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#141414] text-white text-xs font-black uppercase tracking-wider border-2 border-[#141414] shadow-[2px_2px_0px_0px_#FF6633]">
          <Lock className="w-4 h-4 text-[#FF6633]" />
          <span>Restricted Admin Dashboard</span>
        </div>

        {/* Title */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
            Host Login
          </h1>
          <p className="text-xs font-bold text-slate-600 uppercase">
            Please enter your administrator credentials
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-[#FF6633] text-white border-4 border-[#141414] p-4 text-left flex items-start gap-3 shadow-[4px_4px_0px_0px_#141414] w-full">
            <div className="p-1.5 bg-[#141414] text-white border border-white shrink-0 mt-0.5">
              <ShieldAlert className="w-4 h-4 text-[#FF6633]" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black bg-[#141414] text-white px-1.5 py-0.5 uppercase tracking-wider inline-block">
                ACCESS DENIED
              </span>
              <p className="text-xs font-black leading-snug">{error}</p>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-4 text-left">
          {/* Username Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-[#FF6633]" />
              <span>Username</span>
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter admin username"
              className="w-full bg-white border-4 border-[#141414] px-4 py-3 font-bold text-[#141414] placeholder-slate-400 focus:outline-none focus:border-[#FF6633] transition"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-[#FF6633]" />
              <span>Password</span>
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white border-4 border-[#141414] px-4 py-3 font-bold text-[#141414] placeholder-slate-400 focus:outline-none focus:border-[#FF6633] transition"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-4 py-3.5 px-6 bg-[#FF6633] hover:bg-[#141414] active:translate-x-0.5 active:translate-y-0.5 text-white font-black text-sm border-4 border-[#141414] shadow-[4px_4px_0px_0px_#141414] uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all"
          >
            <Lock className="w-4 h-4 fill-current" />
            <span>UNLOG ACCESS</span>
          </button>
        </form>
      </main>

      {/* Footer */}
      <footer className="pt-3 border-t-4 border-[#141414] text-center text-xs font-black uppercase text-[#141414]">
        <span>Yi MIT-WPU Student Chapter • Powered by CII</span>
      </footer>
    </div>
  );
};
