'use client';
import React from 'react';
import { Mail, Phone, MessageCircle, Facebook } from 'lucide-react';
import type { StoreContact } from '@/types/useSettings';

type ContactSectionProps = {
  contact: StoreContact;
};

export const ContactSection: React.FC<ContactSectionProps> = ({ contact }) => {
  const contactItems = [
    {
      icon: Mail,
      label: 'Email',
      value: contact.email,
      href: `mailto:${contact.email}`,
      color: 'text-gray-600'
    },
    {
      icon: Phone,
      label: 'Hotline',
      value: contact.hotline,
      href: `tel:${contact.hotline}`,
      color: 'text-green-600'
    },
    {
      icon: Facebook,
      label: 'Facebook',
      value: contact.facebook,
      href: contact.facebook,
      color: 'text-blue-600'
    },
    {
      icon: MessageCircle,
      label: 'Zalo',
      value: contact.zalo,
      href: contact.zalo,
      color: 'text-blue-500'
    }
  ];

  const formatPhoneNumber = (phone: string) => {
    return phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
  };

  const getDisplayValue = (item: typeof contactItems[0]) => {
    if (item.label === 'Hotline') {
      return formatPhoneNumber(item.value);
    }
    return item.value;
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center mb-6">
        <div className="w-2 h-8 bg-blue-600 rounded-full mr-3"></div>
        <h3 className="text-2xl font-bold text-gray-900">Thông tin liên hệ</h3>
      </div>
      
      <div className="space-y-4">
        {contactItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div 
              key={item.label}
              className="flex items-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200 group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`p-3 rounded-lg bg-white shadow-sm group-hover:shadow-md transition-shadow ${item.color}`}>
                <Icon size={20} />
              </div>
              
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-500 mb-1">{item.label}</p>
                <a
                  href={item.href}
                  target={item.label !== 'Email' && item.label !== 'Hotline' ? '_blank' : '_self'}
                  rel={item.label !== 'Email' && item.label !== 'Hotline' ? 'noopener noreferrer' : ''}
                  className={`text-lg font-semibold hover:underline transition-all duration-200 ${item.color} hover:opacity-80`}
                >
                  {getDisplayValue(item)}
                </a>
              </div>
              
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-500 text-center">
          Liên hệ với chúng tôi qua nhiều kênh hỗ trợ
        </p>
      </div>
    </div>
  );
};