'use client';
import React from 'react';
import { Menu, Search, Globe, Sun, Maximize2 } from 'lucide-react';
import { NotificationMenu } from '@/components/layout/NotificationMenu';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onToggleSidebar} className="p-2 hover:bg-gray-100 rounded-lg">
            <Menu size={20} />
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-80 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 relative">
          {[Globe, Sun, Maximize2].map((Icon, i) => (
            <button key={i} className="p-2 hover:bg-gray-100 rounded-lg">
              <Icon size={20} className="text-gray-600" />
            </button>
          ))}
          <NotificationMenu />
          <div className="flex items-center gap-2 ml-2 cursor-pointer">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full"></div>
            <span className="text-sm font-medium">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};
