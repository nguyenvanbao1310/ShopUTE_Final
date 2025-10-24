// components/layout/Footer.tsx
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between text-sm text-gray-600">
        <p>© 2024 ShopUte. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-purple-600 transition-colors">Điều khoản</a>
          <a href="#" className="hover:text-purple-600 transition-colors">Chính sách</a>
          <a href="#" className="hover:text-purple-600 transition-colors">Hỗ trợ</a>
        </div>
      </div>
    </footer>
  );
};