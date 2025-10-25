'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';

export default function VerifyPage() {
  const router = useRouter();
  const { verifyOtp, resendOtp, error, loading } = useAuth();

  // 🧠 Lấy email từ localStorage (lưu khi user đăng ký hoặc login)
  const [email, setEmail] = useState<string | null>(null);
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    const storedEmail = localStorage.getItem('pending_email');
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      // Nếu không có email (user vô thẳng trang này)
      router.push('/auth/login');
    }
  }, [router]);

  // ⏳ Đếm ngược resend OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // chỉ cho phép nhập số
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // focus sang ô kế tiếp
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== 6 || !email) return;

    try {
      const res = await verifyOtp(email, code);
      setSuccess(true);
      localStorage.removeItem('pending_email'); // dọn dẹp
      setTimeout(() => router.push('/auth/login'), 1500);
    } catch {
      /* error đã hiển thị qua hook */
    }
  };

  const handleResendOtp = async () => {
    if (!email) return;
    try {
      setCountdown(60);
      await resendOtp(email);
      alert('✅ Mã OTP mới đã được gửi đến email của bạn.');
    } catch {
      alert('❌ Gửi lại OTP thất bại.');
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Xác thực tài khoản
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Nhập mã OTP gồm 6 chữ số được gửi đến <br />
          <span className="font-medium text-blue-600">{email}</span>
        </p>

        {error && (
          <p className="text-sm text-red-600 mb-4 text-center">{error}</p>
        )}

        {success ? (
          <p className="text-green-600 text-center font-medium">
            ✅ Xác thực thành công! Đang chuyển đến trang đăng nhập...
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            {/* OTP INPUTS */}
            <div className="flex justify-center gap-3 mb-6">
              {otp.map((digit, idx) => (
                <input
                    key={idx}
                    ref={(el) => { inputsRef.current[idx] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className="w-12 h-12 text-center text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={digit}
                    onChange={(e) => handleChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    disabled={loading}
                />
                ))}
            </div>

            <Button
              type="submit"
              loading={loading}
              disabled={otp.join('').length < 6}
              className="w-full"
            >
              Xác nhận
            </Button>

            <div className="text-center mt-4 text-sm text-gray-600">
              {countdown > 0 ? (
                <span>Gửi lại mã sau {countdown}s</span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-blue-600 hover:underline"
                  disabled={loading}
                >
                  Gửi lại mã OTP
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
