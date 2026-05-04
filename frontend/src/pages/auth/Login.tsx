import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiClient } from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { getErrorMessage } from '../../utils/errorHandler';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { token, role, firstName, id, lastName } = response.data;
      login(token, { firstName, role, lastName, id });
      if (role === 'SUPER_ADMIN') {
        navigate('/admin');
      } else if (role === 'ORG_ADMIN') {
        navigate('/organization');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(getErrorMessage(err) || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5faff] p-6 font-['Inter',sans-serif] antialiased">
      <main className="flex w-full max-w-110 flex-col items-center">
        {/* Brand */}
        <div className="mb-6 flex flex-col items-center">
          <span
            className="material-symbols-outlined mb-2 text-[48px] text-[#002045]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            assured_workload
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-[#002045]">Gestion Charité</h1>
        </div>

        {/* Login Card */}
        <div className="relative flex w-full flex-col gap-6 overflow-hidden rounded-xl border border-[#dee3e8] bg-white p-8 shadow-sm">
          <div className="absolute top-0 right-0 left-0 h-1 bg-[#002045]"></div>

          <div className="text-center">
            <h2 className="mb-1 text-2xl font-semibold text-[#171c20]">Welcome back</h2>
            <p className="mb-4 text-sm text-[#43474e]">
              Enter your credentials to access your portal
            </p>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#dee3e8] bg-[#eff4f9] px-4 py-1 text-[#006d3c]">
              <span className="material-symbols-outlined text-[16px]">lock</span>
              <span className="text-xs font-bold tracking-wider uppercase">Secure Login</span>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-[#ffdad6] p-3 text-sm text-[#ba1a1a]">
              <span className="material-symbols-outlined text-[18px]">error</span>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-[#171c20]">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@organization.org"
                className="w-full rounded-lg border-none bg-[#e9eef3] px-4 py-2 text-base outline-none focus:ring-2 focus:ring-[#002045]"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-[#171c20]">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border-none bg-[#e9eef3] px-4 py-2 text-base outline-none focus:ring-2 focus:ring-[#002045]"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2">
                <input type="checkbox" className="h-4 w-4 rounded text-[#002045]" />
                <span className="text-sm text-[#43474e]">Remember me</span>
              </label>
              <Link to="#" className="text-sm font-semibold text-[#002045] hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#002045] py-3 font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
              {!isLoading && (
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              )}
            </button>
          </form>

          <div className="border-t border-[#dee3e8] pt-4 text-center">
            <p className="text-sm text-[#43474e]">
              Don't have an account?
              <Link to="/register" className="ml-1 font-semibold text-[#002045] hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-8 text-sm text-[#c4c6cf]">© 2026 Gestion Charité. All rights reserved.</p>
      </main>
    </div>
  );
};

export default Login;
