'use client';

import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { InputField } from '@/components/ui/InputField';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Button } from '@/components/ui/Button';

export default function LoginForm() {
  const { login, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // clear lỗi khi user nhập lại
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    const errors: Record<string, string> = {};
    if (!formData.email) {
      errors.email = 'Email không được để trống';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email không hợp lệ';
    }

    if (!formData.password) {
      errors.password = 'Mật khẩu không được để trống';
    } else if (formData.password.length < 6) {
      errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      await login(formData);
    } catch {
      // error đã xử lý trong useAuth
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg transform rotate-45"></div>
          <span className="text-2xl font-bold text-gray-900">UTE Shop</span>
        </div>
      </div>

      {/* Heading */}
      <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
        Welcome to UTE Shop
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Please sign in to your account and start the adventure
      </p>

      {/* Global Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
          <span className="text-sm text-red-800">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <InputField
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder="Enter Email"
          value={formData.email}
          onChange={handleChange}
          disabled={loading}
          error={validationErrors.email}
        />

        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
              Forgot Password?
            </Link>
          </div>

          <PasswordInput
            id="password"
            name="password"
            label=""
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
            error={validationErrors.password}
          />
        </div>

        <Button type="submit" loading={loading}>
          Sign in
        </Button>
      </form>

      {/* Signup Link */}
      <p className="text-center text-sm text-gray-600 mt-6">
        New on our platform?{' '}
        <Link href="/auth/register" className="text-blue-600 font-medium hover:text-blue-700">
          Create an account
        </Link>
      </p>

      {/* Divider */}
      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="text-sm text-gray-500">or</span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>
    </div>
  );
}
