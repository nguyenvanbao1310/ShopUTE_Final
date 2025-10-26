'use client';
import React, { useState } from 'react';
import axios from 'axios';
import type { StoreProfile } from '@/types/useSettings';

type ProfileFormProps = {
  profile: StoreProfile;
};

export const ProfileForm: React.FC<ProfileFormProps> = ({ profile }) => {
  const [form, setForm] = useState({
    ...profile,
    
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setMessage(null);

      // Map gender string -> number
      

      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        
      };

      const res = await axios.put<{ message: string; admin?: StoreProfile }>(
  'http://localhost:8081/api/settings/profile',
  payload
);


      // ✅ cập nhật lại form theo dữ liệu BE trả về
      if (res.data.admin) {
        const updated = res.data.admin;
        setForm({
          firstName: updated.firstName,
          lastName: updated.lastName,
          email: updated.email,
          phone: updated.phone,
          
        });
      }

      setMessage(res.data.message || '✅ Cập nhật thành công!');
    } catch (err) {
      console.error('❌ Lỗi khi lưu hồ sơ:', err);
      setMessage('❌ Cập nhật thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Hồ sơ quản trị viên</h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-600">Họ</label>
          <input
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label className="text-sm text-gray-600">Tên</label>
          <input
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label className="text-sm text-gray-600">Email</label>
          <input
            name="email"
            value={form.email}
            disabled
            className="input input-bordered w-full bg-gray-100"
          />
        </div>
        <div>
          <label className="text-sm text-gray-600">Số điện thoại</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>
        
      </div>

      <button
        onClick={handleSave}
        disabled={loading}
        className={`mt-6 px-4 py-2 rounded-lg text-white ${
          loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
      </button>

      {message && (
        <p
          className={`mt-4 text-sm ${
            message.includes('thành công') ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};
