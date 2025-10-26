"use client";
import { useEffect, useState } from "react";
import type {
  StoreSettings,
  StoreProfile,
  StoreTiming,
  StoreContact,
} from "@/types/useSettings";
import axios from "axios";

export function useSettings() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      try {
        // 🧩 1️⃣ Gọi API thật chỉ cho Profile
        const profileRes = await axios.get<StoreProfile>(
          `${process.env.NEXT_PUBLIC_API_URL}/settings/profile`
        );
        // 🧩 2️⃣ Code cứng cho Timing và Contact
        const mockTiming: StoreTiming[] = [
          { day: "Thứ 2", start: "08:00", end: "18:00", fullDay: false },
          { day: "Thứ 3", start: "08:00", end: "18:00", fullDay: false },
          { day: "Thứ 4", start: "08:00", end: "18:00", fullDay: false },
          { day: "Thứ 5", start: "08:00", end: "18:00", fullDay: false },
          { day: "Thứ 6", start: "08:00", end: "18:00", fullDay: false },
          { day: "Thứ 7", start: "09:00", end: "16:00", fullDay: false },
          { day: "Chủ nhật", start: "Nghỉ", end: "", fullDay: true },
        ];

        const mockContact: StoreContact = {
          email: "support@shopute.vn",
          hotline: "1800 9999",
          facebook: "https://facebook.com/shopute",
          zalo: "https://zalo.me/123456789",
        };

        // 🧩 3️⃣ Gộp chung thành StoreSettings
        setSettings({
          profile: profileRes.data,
          timing: mockTiming,
          contact: mockContact,
        });
      } catch (error) {
        console.error("❌ Lỗi khi tải dữ liệu cài đặt:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, []);

  return { settings, loading };
}
