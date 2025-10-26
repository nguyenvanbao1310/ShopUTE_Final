'use client';
import { useEffect, useState } from 'react';
import type { StoreSettings, StoreProfile, StoreTiming, StoreContact } from '@/types/useSettings';
import axios from 'axios';

export function useSettings() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      try {
        // ⚙️ Gọi API backend NestJS thật
        const [profileRes, timingRes, contactRes] = await Promise.all([
          axios.get<StoreProfile>('http://localhost:8081/api/settings/profile'),
          axios.get<StoreTiming[]>('http://localhost:8081/api/settings/timing'),
          axios.get<StoreContact>('http://localhost:8081/api/settings/contact'),
        ]);

        setSettings({
          profile: profileRes.data,
          timing: timingRes.data,
          contact: contactRes.data,
        });
      } catch (error) {
        console.error('❌ Lỗi khi tải dữ liệu cài đặt:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, []);

  return { settings, loading };
}
