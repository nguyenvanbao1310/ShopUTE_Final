import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NotificationProvider } from "../components/websocket/NotificationContext";
import { WebSocketManager } from "../components/websocket/WebSocketManager";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShopUTe Admin Dashboard",
  description: "Admin dashboard for ShopUTe",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NotificationProvider>
          {children}
          {/* ✅ Quản lý kết nối WS realtime */}
          <WebSocketManager />
          {/* ✅ Hiển thị toast thông báo */}
          <ToastContainer position="top-right" autoClose={3000} />
        </NotificationProvider>
      </body>
    </html>
  );
}
