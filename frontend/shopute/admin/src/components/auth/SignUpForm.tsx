'use client';

import { useState } from 'react';
import Link from 'next/link';
import { InputField } from '../ui/InputField';
import { PasswordInput } from '../ui/PasswordInput';
import { Checkbox } from '../ui/CheckBox';
import { Button } from '../ui/Button';
import { useAuth } from '@/hooks/useAuth';
export default function SignupForm() {
  const { register, loading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    rememberMe: false
  });
  const [validationErrors, setValidationErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!formData.firstName.trim()) errors.firstName = 'First name không được để trống';
    if (!formData.lastName.trim()) errors.lastName = 'Last name không được để trống';
    if (!formData.email.trim()) {
      errors.email = 'Email không được để trống';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email không hợp lệ';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'Phone không được để trống';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      errors.phone = 'Phone không hợp lệ';
    }
    if (!formData.password) {
      errors.password = 'Mật khẩu không được để trống';
    } else if (formData.password.length < 6) {
      errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Vui lòng nhập lại mật khẩu';
    } else if (formData.confirmPassword !== formData.password) {
      errors.confirmPassword = 'Mật khẩu không khớp';
    }
    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) return;
    try {
      await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
      });
      // useAuth sẽ tự động login + chuyển hướng /dashboard
    } catch {
      // lỗi đã xử lý trong useAuth
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors((prev) => ({ ...prev, [name]: undefined }));
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
      <p className="text-center text-gray-600 mb-8">
        Create your account to get started.
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
      <InputField
        id="firstName"
        name="firstName"
        label="First Name"
        placeholder="Enter First Name"
        value={formData.firstName}
        onChange={handleChange}
        error={validationErrors.firstName}
      />
      <InputField
        id="lastName"
        name="lastName"
        label="Last Name"
        placeholder="Enter Last Name"
        value={formData.lastName}
        onChange={handleChange}
        error={validationErrors.lastName}
      />
      <InputField
        id="email"
        name="email"
        type="email"
        label="Email"
        placeholder="Enter Email"
        value={formData.email}
        onChange={handleChange}
        error={validationErrors.email}
      />
      <InputField
        id="phone"
        name="phone"
        type="tel"
        label="Phone"
        placeholder="Enter Phone Number"
        value={formData.phone}
        onChange={handleChange}
        error={validationErrors.phone}
      />

      <PasswordInput
        id="password"
        name="password"
        label="Password"
        placeholder="Enter Password"
        value={formData.password}
        onChange={handleChange} 
        error={validationErrors.password}
      />
      <PasswordInput
        id="confirmPassword"
        name="confirmPassword"
        label="Confirm Password"
        placeholder="Enter Password Again"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={validationErrors.confirmPassword}
      />

      <Checkbox
        id="rememberMe"
        name="rememberMe"
        label="Remember Me"
        checked={formData.rememberMe}
        onChange={handleChange}
      />

      <Button type="submit">Sign up</Button>
    </form>

      {/* Login Link */}
      <p className="text-center text-sm text-gray-600 mt-6">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-blue-600 font-medium hover:text-blue-700">
          Log in
        </Link>
      </p>

      {/* Divider */}
      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="text-sm text-gray-500">or</span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>

      {/* Social Login */}
    </div>
  );
}