'use client';
import React, { useState } from 'react';
import { useSettings } from '@/hooks/useSettings';
import { ProfileForm } from '@/components/setting/ProfileForm';
import { TimingSection } from '@/components/setting/TimingSection';
import { ContactSection } from '@/components/setting/ContactSection';
import { PolicySection } from '@/components/setting/PolicySection'; // 🆕 thêm dòng này

export default function SettingsPage() {
  const { settings, loading } = useSettings();
  const [tab, setTab] = useState<'profile' | 'timing' | 'contact' | 'policy'>('profile');

  if (loading || !settings) {
    return (
      <div className="flex justify-center items-center h-[50vh] text-gray-500">
        Đang tải dữ liệu cài đặt...
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Cài đặt hệ thống</h2>

      {/* Tabs */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={() => setTab('profile')}
          className={`px-4 py-2 rounded-lg font-medium ${
            tab === 'profile' ? 'bg-green-600 text-white' : 'bg-white border'
          }`}
        >
          Hồ sơ
        </button>

        <button
          onClick={() => setTab('timing')}
          className={`px-4 py-2 rounded-lg font-medium ${
            tab === 'timing' ? 'bg-green-600 text-white' : 'bg-white border'
          }`}
        >
          Giờ làm việc
        </button>

        <button
          onClick={() => setTab('contact')}
          className={`px-4 py-2 rounded-lg font-medium ${
            tab === 'contact' ? 'bg-green-600 text-white' : 'bg-white border'
          }`}
        >
          Liên hệ
        </button>

        <button
          onClick={() => setTab('policy')}
          className={`px-4 py-2 rounded-lg font-medium ${
            tab === 'policy' ? 'bg-green-600 text-white' : 'bg-white border'
          }`}
        >
          Chính sách
        </button>
      </div>

      {/* Sections */}
      {tab === 'profile' && <ProfileForm profile={settings.profile} />}
      {tab === 'timing' && <TimingSection timing={settings.timing} />}
      {tab === 'contact' && <ContactSection contact={settings.contact} />}
      {tab === 'policy' && <PolicySection />}
    </div>
  );
}
