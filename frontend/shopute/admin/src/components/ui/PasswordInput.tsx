'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function PasswordInput({ label, error, ...props }: PasswordInputProps) {
  const [show, setShow] = useState(false);

  return (
    <div>
      <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          {...props}
          type={show ? 'text' : 'password'}
          className={`w-full px-4 py-2.5 border rounded-lg pr-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
            error ? 'border-red-500' : 'border-gray-300'
          } ${props.disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          disabled={props.disabled}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:cursor-not-allowed"
        >
          {show ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
