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
      // If successful, redirect to login page
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">Join Gestion Charité</h2>
        
        {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded">{error}</div>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block mb-1 text-sm font-semibold text-gray-700">First Name</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="w-1/2">
              <label className="block mb-1 text-sm font-semibold text-gray-700">Last Name</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700">Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700">I want to...</label>
            <select name="role" value={formData.role} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="USER">Donate to campaigns (User)</option>
              <option value="ORG_ADMIN">Register an Organization (Org Admin)</option>
            </select>
          </div>

          <button type="submit" disabled={isLoading} className="w-full p-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-blue-300 transition-colors">
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Log in here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;