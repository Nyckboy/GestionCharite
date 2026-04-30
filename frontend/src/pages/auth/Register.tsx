import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiClient } from '../../api/axios';
import type { Role } from '../../types';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'USER' as Role,
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await apiClient.post('/auth/register', formData);
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#f5faff] min-h-screen flex items-center justify-center p-6 antialiased font-['Inter',sans-serif]">
      <main className="w-full max-w-120 flex flex-col items-center">
        
        {/* Brand / Identity */}
        <div className="mb-6 flex flex-col items-center">
          <span className="material-symbols-outlined text-[#002045] text-[48px] mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>
            person_add
          </span>
          <h1 className="text-3xl font-bold text-[#002045] tracking-tight text-center">Gestion Charité</h1>
        </div>

        {/* Register Card Container */}
        <div className="w-full bg-white rounded-xl border border-[#dee3e8] shadow-sm p-8 flex flex-col gap-6 relative overflow-hidden">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#002045]"></div>

          {/* Header */}
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-[#171c20] mb-1">Create an account</h2>
            <p className="text-sm text-[#43474e] mb-4">Join our community and start making an impact</p>
            <div className="inline-flex items-center gap-2 bg-[#eff4f9] border border-[#dee3e8] rounded-full px-4 py-1 text-[#006d3c]">
              <span className="material-symbols-outlined text-[16px]">verified_user</span>
              <span className="text-xs font-bold uppercase tracking-wider">Secure Registration</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 text-sm text-[#ba1a1a] bg-[#ffdad6] border border-[#ba1a1a]/10 rounded-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              {error}
            </div>
          )}

          {/* Form Area */}
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            {/* Name Row */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 flex flex-col gap-1">
                <label className="text-sm font-semibold text-[#171c20]">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  className="w-full bg-[#e9eef3] border-none text-base rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#002045] outline-none transition-all"
                  required
                />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <label className="text-sm font-semibold text-[#171c20]">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className="w-full bg-[#e9eef3] border-none text-base rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#002045] outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-[#171c20]">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="w-full bg-[#e9eef3] border-none text-base rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#002045] outline-none transition-all"
                required
              />
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-[#171c20]">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-[#e9eef3] border-none text-base rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#002045] outline-none transition-all"
                required
              />
            </div>

            {/* Role Selection */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-[#171c20]">I want to...</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full bg-[#e9eef3] border-none text-base rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#002045] outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="USER">Donate to campaigns (User)</option>
                <option value="ORG_ADMIN">Register an Organization (Org Admin)</option>
              </select>
            </div>

            {/* Primary CTA */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-[#002045] text-white font-semibold py-3 rounded-lg hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
              {!isLoading && <span className="material-symbols-outlined text-[18px]">how_to_reg</span>}
            </button>
          </form>

          {/* Login Link */}
          <div className="pt-4 border-t border-[#dee3e8] text-center">
            <p className="text-sm text-[#43474e]">
              Already have an account? 
              <Link to="/login" className="font-semibold text-[#002045] hover:underline ml-1">
                Log in here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-sm text-[#c4c6cf]">© 2026 Gestion Charité. All rights reserved.</p>
      </main>
    </div>
  );
};

export default Register;