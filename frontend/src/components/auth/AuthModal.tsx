import React, { useState } from 'react';
import { Person } from '../../types/genealogy';
import { apiService } from '../../services/api';
import { X, LogIn, UserPlus, Shield, Check, UserCheck, AlertCircle, Sparkles, Eye, EyeOff } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  allPersons: Person[];
  onAuthSuccess: (token: string, fullName: string, linkedPersonId?: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  allPersons,
  onAuthSuccess,
}) => {
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('admin@giaphaviet.vn');
  const [loginPassword, setLoginPassword] = useState('Admin@123456');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register form state
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [selectedPersonId, setSelectedPersonId] = useState<string>('NONE');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.login(loginEmail, loginPassword);
      // Auto link to matching name if exists
      const matched = allPersons.find(
        (p) => p.fullName.toLowerCase() === res.fullName?.toLowerCase()
      );
      onAuthSuccess(res.token, res.fullName, matched?.id);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regPassword !== regConfirmPassword) {
      setError('Mật khẩu xác nhận không trùng khớp!');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.register(regEmail, regPassword, regFullName);
      const linkedId = selectedPersonId !== 'NONE' ? selectedPersonId : undefined;
      onAuthSuccess(res.token, res.fullName || regFullName, linkedId);
      onClose();
      alert(`Đăng ký tài khoản thành công! Chào mừng ${regFullName} gia nhập Gia Phả Việt.`);
    } catch (err: any) {
      setError(err.message || 'Đăng ký thất bại. Email có thể đã tồn tại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="bg-[#FAF7EE] border border-[#D5C7A9] rounded-2xl shadow-2xl max-w-md w-full max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#8B2E2E] to-[#6E2222] text-white px-6 py-4 flex items-center justify-between border-b border-[#C49A45]/40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#E5C378]/20 border border-[#E5C378]/40 flex items-center justify-center text-[#E5C378]">
              {mode === 'LOGIN' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="font-serif font-bold text-base tracking-wide">
                {mode === 'LOGIN' ? 'Đăng Nhập Quản Trị Dòng Họ' : 'Đăng Ký Tài Khoản Gia Tộc'}
              </h3>
              <p className="text-[11px] text-[#E5C378]/90">
                Gia Phả Việt 4.0 • Xác thực bảo mật JWT
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-black/20 hover:bg-black/40 flex items-center justify-center text-white/80 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="flex border-b border-stone-200 bg-stone-100/70 p-1 m-4 rounded-xl">
          <button
            type="button"
            onClick={() => { setMode('LOGIN'); setError(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'LOGIN'
                ? 'bg-white text-[#8B2E2E] shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Đăng Nhập
          </button>
          <button
            type="button"
            onClick={() => { setMode('REGISTER'); setError(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'REGISTER'
                ? 'bg-white text-[#8B2E2E] shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Đăng Ký Mới
          </button>
        </div>

        {error && (
          <div className="mx-6 mb-2 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Content */}
        <div className="px-6 pb-6 overflow-y-auto">
          {mode === 'LOGIN' ? (
            <form onSubmit={handleLogin} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-stone-800 mb-1">Email đăng nhập:</label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-stone-300 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#8B2E2E]"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">Mật khẩu:</label>
                <div className="relative">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pr-10 pl-2.5 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#8B2E2E]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                    title={showLoginPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-[#8B2E2E]" />}
                  </button>
                </div>
              </div>

              <div className="p-3 bg-stone-100 rounded-xl border border-stone-200 text-[11px] text-stone-600 space-y-1">
                <span className="font-bold text-stone-800 block">Tài khoản kiểm thử nhanh:</span>
                <div>Admin: <strong>admin@giaphaviet.vn</strong> / <strong>Admin@123456</strong></div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gradient-to-r from-[#8B2E2E] to-[#6E2222] hover:from-[#6E2222] hover:to-[#8B2E2E] text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4 text-[#E5C378]" />
                {loading ? 'Đang xác thực...' : 'Đăng Nhập Hệ Thống'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-800 mb-1">
                  Họ và tên của bạn: <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn Minh"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-stone-300 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#8B2E2E]"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">
                  Địa chỉ Email: <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-stone-300 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#8B2E2E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-stone-800 mb-1">Mật khẩu:</label>
                  <div className="relative">
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      placeholder="Tối thiểu 6 ký tự"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full pr-8 pl-2.5 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#8B2E2E]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                      title={showRegPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    >
                      {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-[#8B2E2E]" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-stone-800 mb-1">Xác nhận:</label>
                  <div className="relative">
                    <input
                      type={showRegConfirmPassword ? 'text' : 'password'}
                      required
                      placeholder="Nhập lại mật khẩu"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      className="w-full pr-8 pl-2.5 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#8B2E2E]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                      title={showRegConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    >
                      {showRegConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-[#8B2E2E]" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Core Feature: Account to Person Binding */}
              <div className="pt-2 border-t border-stone-200">
                <label className="block font-bold text-stone-800 mb-1 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-emerald-700" />
                  Bạn là thành viên nào trên cây gia phả?
                </label>
                <p className="text-[11px] text-stone-500 mb-2">
                  Giúp hệ thống tự động nhận diện vị trí của bạn, làm nổi bật trên phả đồ và tính toán xưng hô tự động.
                </p>
                <select
                  value={selectedPersonId}
                  onChange={(e) => setSelectedPersonId(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="NONE">-- Tôi là người mới (Chưa có tên trên cây) --</option>
                  {allPersons
                    .filter((p) => p.status === 'LIVING')
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.fullName} (Đời {p.generation} - {p.branchName})
                      </option>
                    ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-2"
              >
                <UserPlus className="w-4 h-4 text-[#E5C378]" />
                {loading ? 'Đang tạo tài khoản...' : 'Hoàn Tất Đăng Ký'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
