import React, { useState } from 'react';
import { apiService } from '../../services/api';
import { 
  ShieldCheck, Lock, User, Mail, KeyRound, Sparkles, 
  ArrowRight, UserPlus, CheckCircle2, AlertCircle, Eye, EyeOff 
} from 'lucide-react';

interface ClanAuthGateProps {
  onAuthSuccess: (token: string, fullName: string, linkedPersonId?: string) => void;
  clanName?: string;
}

export const ClanAuthGate: React.FC<ClanAuthGateProps> = ({
  onAuthSuccess,
  clanName = 'Gia Phả Dòng Họ Việt Nam',
}) => {
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  
  // Login State
  const [loginEmail, setLoginEmail] = useState<string>('admin@giaphaviet.vn');
  const [loginPassword, setLoginPassword] = useState<string>('Admin@123456');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Register State
  const [regFullName, setRegFullName] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('');
  const [regConfirmPassword, setRegConfirmPassword] = useState<string>('');
  const [showRegPassword, setShowRegPassword] = useState<boolean>(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState<boolean>(false);
  const [regBranchNote, setRegBranchNote] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.login(loginEmail, loginPassword);
      onAuthSuccess(res.token, res.fullName || 'Quản Trị Viên');
    } catch (err: any) {
      setError(err.message || 'Email hoặc mật khẩu không chính xác.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regPassword !== regConfirmPassword) {
      setError('Mật khẩu xác nhận không trùng khớp.');
      return;
    }
    if (regPassword.length < 6) {
      setError('Mật khẩu cần tối thiểu 6 ký tự.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await apiService.register(regEmail, regPassword, regFullName);
      setSuccessMessage('Đăng ký tài khoản thành công! Bạn có thể đăng nhập ngay.');
      setMode('LOGIN');
      setLoginEmail(regEmail);
      setLoginPassword(regPassword);
    } catch (err: any) {
      setError(err.message || 'Đăng ký thất bại. Email có thể đã được đăng ký.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setLoginEmail('admin@giaphaviet.vn');
    setLoginPassword('Admin@123456');
    setError(null);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#181D1B] via-[#2A1616] to-[#141816] text-white flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Ambient background glow & traditional aesthetics */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#8B2E2E]/25 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#C5A059]/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      {/* Header bar */}
      <header className="p-6 relative z-10 flex items-center justify-between border-b border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B2E2E] to-[#681E1E] border border-[#C5A059]/60 flex items-center justify-center font-serif text-xl font-bold text-[#F9F5EC] shadow-md">
            GP
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-lg text-[#F9F5EC] tracking-wide">
                Gia Phả Việt
              </span>
              <span className="text-[10px] bg-[#C5A059]/20 text-[#E5C378] font-bold px-1.5 py-0.5 rounded border border-[#C5A059]/40">
                4.0
              </span>
            </div>
            <p className="text-[11px] text-gray-400">
              Hệ Thống Phả Ký & Quản Trị Dòng Họ Nội Bộ
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-300 bg-black/40 px-3 py-1.5 rounded-full border border-white/10">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="hidden sm:inline">Hệ Thống Bảo Mật Nội Bộ</span>
        </div>
      </header>

      {/* Main Authentication Box */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 relative z-10 my-4">
        <div className="w-full max-w-md bg-[#222826]/90 backdrop-blur-xl rounded-3xl border-2 border-[#C5A059]/40 shadow-2xl p-6 sm:p-8 space-y-6">
          
          {/* Clan Badge & Privacy Warning */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#8B2E2E] to-[#A23838] border-2 border-[#E5C378] mx-auto flex items-center justify-center shadow-lg shadow-[#8B2E2E]/40">
              <Lock className="w-7 h-7 text-[#F9F5EC]" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-[#F9F5EC] tracking-tight">
              {clanName}
            </h1>
            <p className="text-xs text-amber-200/90 leading-relaxed max-w-sm mx-auto bg-amber-500/10 border border-amber-500/30 rounded-xl p-2.5">
              🔒 <strong>Khu vực bảo mật nội bộ gia tộc:</strong> Toàn bộ cây phả hệ, thông tin thành viên, ngày kỵ và mồ mả chỉ hiển thị sau khi xác thực thành viên.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 gap-1 bg-black/40 p-1.5 rounded-xl border border-white/10 text-xs font-bold">
            <button
              type="button"
              onClick={() => { setMode('LOGIN'); setError(null); }}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                mode === 'LOGIN'
                  ? 'bg-gradient-to-r from-[#8B2E2E] to-[#A23838] text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              Đăng Nhập
            </button>
            <button
              type="button"
              onClick={() => { setMode('REGISTER'); setError(null); }}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                mode === 'REGISTER'
                  ? 'bg-gradient-to-r from-[#8B2E2E] to-[#A23838] text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              Đăng Ký Thành Viên
            </button>
          </div>

          {/* Error & Success Messages */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 text-xs text-red-200 flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="bg-emerald-500/20 border border-emerald-500/50 rounded-xl p-3 text-xs text-emerald-200 flex items-start gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form 1: LOGIN */}
          {mode === 'LOGIN' && (
            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1.5">
                  Email Thành Viên:
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    placeholder="vidu: conchao@giaphaviet.vn"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1.5">
                  Mật Khẩu Truy Cập:
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Demo auto-fill hint */}
              <div className="flex items-center justify-between text-[11px] pt-1">
                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="text-[#E5C378] hover:underline flex items-center gap-1 font-medium"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Dùng thử tài khoản Quản Trị (Click điền nhanh)
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-[#8B2E2E] via-[#A23838] to-[#8B2E2E] hover:from-[#9D3434] hover:to-[#7A2424] text-white font-bold rounded-xl shadow-lg shadow-[#8B2E2E]/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 border border-[#E5C378]/50 disabled:opacity-50"
              >
                {loading ? (
                  <span>Đang xác thực thông tin...</span>
                ) : (
                  <>
                    <span>Mở Khóa & Vào Xem Gia Phả</span>
                    <ArrowRight className="w-4 h-4 text-[#E5C378]" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Form 2: REGISTER */}
          {mode === 'REGISTER' && (
            <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  Họ và Tên Đầy Đủ:
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    required
                    placeholder="ví dụ: Nguyễn Trọng Hải"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  Địa Chỉ Email:
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                    placeholder="email@example.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">
                    Mật Khẩu:
                  </label>
                  <div className="relative">
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      required
                      placeholder="Tối thiểu 6 ký tự"
                      className="w-full pr-8 pl-2.5 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      title={showRegPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    >
                      {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-[#E5C378]" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">
                    Xác Nhận Mật Khẩu:
                  </label>
                  <div className="relative">
                    <input
                      type={showRegConfirmPassword ? 'text' : 'password'}
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      required
                      placeholder="Nhập lại mật khẩu"
                      className="w-full pr-8 pl-2.5 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      title={showRegConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    >
                      {showRegConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-[#E5C378]" />}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  Ghi chú chi họ / Con ông/bà nào (Không bắt buộc):
                </label>
                <input
                  type="text"
                  value={regBranchNote}
                  onChange={(e) => setRegBranchNote(e.target.value)}
                  placeholder="ví dụ: Con trai cả của ông Nguyễn Quý Công (Chi Trưởng)"
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 border border-emerald-400/40 disabled:opacity-50"
              >
                {loading ? (
                  <span>Đang tạo tài khoản...</span>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Đăng Ký Thành Viên Dòng Họ</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Security Credentials Demo Note */}
          <div className="pt-3 border-t border-white/10 text-center text-[11px] text-gray-400 space-y-1">
            <p>Tài khoản Quản Trị Hệ Thống mẫu:</p>
            <p className="font-mono text-[#E5C378]">
              admin@giaphaviet.vn • Mật khẩu: Admin@123456
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-xs text-gray-500 relative z-10 border-t border-white/5">
        <p>Gia Phả Việt 4.0 • Phần Mềm Quản Trị Gia Phả Đa Dòng Tộc Chuẩn Việt Nam</p>
      </footer>
    </div>
  );
};
