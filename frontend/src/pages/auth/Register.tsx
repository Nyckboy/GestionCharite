import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiClient } from '../../api/axios';
import type { Role } from '../../types';
import { getErrorMessage } from '../../utils/errorHandler';

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
    } catch (err) {
      setError(getErrorMessage(err) || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5faff] p-6 font-['Inter',sans-serif] antialiased">
      <main className="flex w-full max-w-120 flex-col items-center">
        {/* Brand / Identity */}
        <div className="mb-6 flex flex-col items-center">
          <span
            className="material-symbols-outlined mb-2 text-[48px] text-[#002045]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            person_add
          </span>
          <h1 className="text-center text-3xl font-bold tracking-tight text-[#002045]">
            Gestion Charité
          </h1>
        </div>

        {/* Register Card Container */}
        <div className="relative flex w-full flex-col gap-6 overflow-hidden rounded-xl border border-[#dee3e8] bg-white p-8 shadow-sm">
          {/* Top accent line */}
          <div className="absolute top-0 right-0 left-0 h-1 bg-[#002045]"></div>

          {/* Header */}
          <div className="text-center">
            <h2 className="mb-1 text-2xl font-semibold text-[#171c20]">Create an account</h2>
            <p className="mb-4 text-sm text-[#43474e]">
              Join our community and start making an impact
            </p>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#dee3e8] bg-[#eff4f9] px-4 py-1 text-[#006d3c]">
              <span className="material-symbols-outlined text-[16px]">verified_user</span>
              <span className="text-xs font-bold tracking-wider uppercase">
                Secure Registration
              </span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-[#ba1a1a]/10 bg-[#ffdad6] p-3 text-sm text-[#ba1a1a]">
              <span className="material-symbols-outlined text-[18px]">error</span>
              {error}
            </div>
          )}

          {/* Form Area */}
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            {/* Name Row */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex flex-1 flex-col gap-1">
                <label className="text-sm font-semibold text-[#171c20]">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  className="w-full rounded-lg border-none bg-[#e9eef3] px-4 py-2 text-base transition-all outline-none focus:ring-2 focus:ring-[#002045]"
                  required
                />
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <label className="text-sm font-semibold text-[#171c20]">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className="w-full rounded-lg border-none bg-[#e9eef3] px-4 py-2 text-base transition-all outline-none focus:ring-2 focus:ring-[#002045]"
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
                className="w-full rounded-lg border-none bg-[#e9eef3] px-4 py-2 text-base transition-all outline-none focus:ring-2 focus:ring-[#002045]"
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
                className="w-full rounded-lg border-none bg-[#e9eef3] px-4 py-2 text-base transition-all outline-none focus:ring-2 focus:ring-[#002045]"
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
                className="w-full cursor-pointer appearance-none rounded-lg border-none bg-[#e9eef3] px-4 py-2 text-base transition-all outline-none focus:ring-2 focus:ring-[#002045]"
              >
                <option value="USER">Donate to campaigns (User)</option>
                <option value="ORG_ADMIN">Register an Organization (Org Admin)</option>
              </select>
            </div>

            {/* Primary CTA */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-[#002045] py-3 font-semibold text-white transition-all hover:opacity-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
              {!isLoading && (
                <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="border-t border-[#dee3e8] pt-4 text-center">
            <p className="text-sm text-[#43474e]">
              Already have an account?
              <Link to="/login" className="ml-1 font-semibold text-[#002045] hover:underline">
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
