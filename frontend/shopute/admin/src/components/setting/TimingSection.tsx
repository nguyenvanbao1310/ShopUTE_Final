'use client';
import React, { useState } from 'react';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';
import type { StoreTiming } from '@/types/useSettings';

type TimingSectionProps = {
  timing: StoreTiming[];
};

export const TimingSection: React.FC<TimingSectionProps> = ({ timing }) => {
  const [data, setData] = useState(timing);

  const handleToggle = (index: number) => {
    const updated = [...data];
    updated[index].fullDay = !updated[index].fullDay;
    setData(updated);
  };

  const handleChange = (
    index: number,
    field: 'start' | 'end',
    value: string
  ) => {
    const updated = [...data];
    updated[index][field] = value;
    setData(updated);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <Clock className="w-6 h-6 text-green-600" />
          Giờ làm việc trong tuần
        </h3>
        <span className="text-sm text-gray-500 italic">
          Cập nhật: 26/10/2025
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Ngày
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Trạng thái
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Giờ mở cửa
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Giờ đóng cửa
              </th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">
                Hành động
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 bg-white">
            {data.map((item, idx) => (
              <tr
                key={item.day}
                className="hover:bg-gray-50 transition-all duration-200"
              >
                {/* Ngày */}
                <td className="px-4 py-3 font-medium text-gray-800">
                  {item.day}
                </td>

                {/* Trạng thái */}
                <td className="px-4 py-3">
                  {!item.fullDay ? (
                    <span className="flex items-center gap-2 text-green-600 font-medium">
                      <CheckCircle2 className="w-4 h-4" /> Làm việc
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 text-red-500 font-medium">
                      <XCircle className="w-4 h-4" /> Nghỉ
                    </span>
                  )}
                </td>

                {/* Giờ mở */}
                <td className="px-4 py-3">
                  {!item.fullDay ? (
                    <input
                      type="time"
                      value={item.start}
                      onChange={(e) =>
                        handleChange(idx, 'start', e.target.value)
                      }
                      className="input input-bordered input-sm w-32"
                    />
                  ) : (
                    <input
                      type="time"
                      disabled
                      value={item.start}
                      className="input input-bordered input-sm w-32 bg-gray-100 cursor-not-allowed"
                    />
                  )}
                </td>

                {/* Giờ đóng */}
                <td className="px-4 py-3">
                  {!item.fullDay ? (
                    <input
                      type="time"
                      value={item.end}
                      onChange={(e) =>
                        handleChange(idx, 'end', e.target.value)
                      }
                      className="input input-bordered input-sm w-32"
                    />
                  ) : (
                    <input
                      type="time"
                      disabled
                      value={item.end}
                      className="input input-bordered input-sm w-32 bg-gray-100 cursor-not-allowed"
                    />
                  )}
                </td>

                {/* Nút hành động */}
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleToggle(idx)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                      item.fullDay
                        ? 'bg-green-100 text-green-600 hover:bg-green-200'
                        : 'bg-red-100 text-red-600 hover:bg-red-200'
                    }`}
                  >
                    {item.fullDay ? 'Làm việc cả ngày' : 'Chuyển nghỉ'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <button className="px-5 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition">
          💾 Lưu thay đổi
        </button>
      </div>
    </div>
  );
};
