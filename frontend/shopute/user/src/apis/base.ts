import axios, { AxiosHeaders } from "axios";
import { store } from "../store/store";

export const BASE_URL = "http://localhost:8088/api";

/** Luôn trả string, tránh null gây TS2322 */
export function getDeviceId(): string {
  try {
    const KEY = "deviceId";
    let id = localStorage.getItem(KEY) ?? "";
    if (!id) {
      id = crypto?.randomUUID?.() ?? `dev-${Math.random().toString(36).slice(2, 12)}`;
      localStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    return "device-fallback";
  }
}

// Nhân Sam Note ở đay :  hàm getToken này là hàm lấy token từ store của redux, mà ở trong addressapi
// gọi lại base thế là có vòng lặp vô hạn, nên tạm thời comment lại

// góp ý là lưu toke trong seassionStorage, không nên lưu trong localstorage vì lý do bảo mật
// tạm thời viết 1 hàm bẫn lấy toklen từ localstorage để thay thế
function getToken(): string | undefined {
  const t =
    localStorage.getItem("token") ??
    localStorage.getItem("accessToken") ??
    undefined;
  return typeof t === "string" && t.trim() ? t : undefined;
}

// /** Token dùng cho Authorization; undefined nếu không có */
// function getToken(): string | undefined {
//   try {
//     const s: any = store.getState?.();
//     const t =
//       s?.auth?.token ??
//       s?.auth?.accessToken ??
//       s?.auth?.user?.token ??
//       localStorage.getItem("token") ??
//       localStorage.getItem("accessToken") ??
//       undefined;
//     return typeof t === "string" && t.trim() ? t : undefined;
//   } catch {
//     return undefined;
//   }
// }

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const headers = config.headers as AxiosHeaders;
  const token = getToken();

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
    headers.delete("x-device-id");
  } else {
    headers.set("x-device-id", getDeviceId());
    headers.delete("Authorization");
  }

  return config;
});

export default api;
