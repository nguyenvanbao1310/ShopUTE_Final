'use client';
import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  trend: 'up' | 'down';
  trendValue: string;
  icon: React.ElementType;
  bgColor: string;
  iconColor: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, trend, trendValue, icon: Icon, bgColor, iconColor }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-500 text-sm mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        <p hidden={!trendValue} className={`text-sm mt-2 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
          {trend === 'up' ? '↑' : '↓'} {trendValue} Tuần này
        </p>
      </div>
      <div className={`w-14 h-14 ${bgColor} rounded-xl flex items-center justify-center`}>
        <Icon className={iconColor} size={24} />
      </div>
    </div>
  </div>
);
