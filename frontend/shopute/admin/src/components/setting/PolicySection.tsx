'use client';
import React from 'react';
import { ShieldCheck, RefreshCcw, Lock, FileText, Truck } from 'lucide-react';

export const PolicySection: React.FC = () => {
  const policies = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-green-600" />,
      title: 'Chính sách bảo hành',
      short: 'Bảo hành chính hãng lên đến 12 tháng',
      details: [
        '🔧 Sản phẩm được bảo hành chính hãng trong 12 tháng kể từ ngày mua.',
        '📦 Chỉ áp dụng cho lỗi kỹ thuật từ nhà sản xuất, không áp dụng cho hao mòn tự nhiên.',
        '⚙️ Hỗ trợ kiểm tra, bảo dưỡng miễn phí trong thời gian bảo hành.',
      ],
    },
    {
      icon: <RefreshCcw className="w-6 h-6 text-blue-500" />,
      title: 'Chính sách đổi trả',
      short: 'Đổi trả linh hoạt trong vòng 7 ngày',
      details: [
        '🔁 Hỗ trợ đổi trả sản phẩm trong 7 ngày nếu phát sinh lỗi kỹ thuật.',
        '💰 Hoàn tiền 100% hoặc đổi sang sản phẩm tương đương.',
        '📄 Sản phẩm phải còn nguyên tem, hộp, phụ kiện đầy đủ.',
      ],
    },
    {
      icon: <Lock className="w-6 h-6 text-purple-600" />,
      title: 'Chính sách bảo mật thông tin',
      short: 'Cam kết bảo mật tuyệt đối thông tin khách hàng',
      details: [
        '🔒 Chúng tôi không chia sẻ thông tin cá nhân khách hàng với bên thứ ba.',
        '🧩 Dữ liệu được mã hóa và lưu trữ an toàn theo chuẩn quốc tế.',
        '📧 Mọi hoạt động thu thập thông tin đều có sự đồng ý của người dùng.',
      ],
    },
    {
      icon: <FileText className="w-6 h-6 text-orange-500" />,
      title: 'Điều khoản sử dụng',
      short: 'Quy định khi sử dụng website & dịch vụ',
      details: [
        '📜 Khi truy cập website, người dùng đồng ý với các điều khoản sử dụng.',
        '💡 Người dùng không được phép sao chép hoặc tái phân phối nội dung mà không có sự đồng ý.',
        '⚖️ Cửa hàng có quyền thay đổi điều khoản mà không cần thông báo trước.',
      ],
    },
    {
      icon: <Truck className="w-6 h-6 text-teal-500" />,
      title: 'Chính sách giao hàng',
      short: 'Miễn phí vận chuyển toàn quốc cho đơn từ 1 triệu',
      details: [
        '🚚 Giao hàng tận nơi trong vòng 2–4 ngày làm việc.',
        '💨 Hỗ trợ giao nhanh trong 24h tại khu vực nội thành.',
        '📦 Miễn phí vận chuyển cho đơn hàng có giá trị từ 1.000.000đ trở lên.',
      ],
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-semibold text-gray-800 tracking-tight">
          🏬 Chính sách & Điều khoản của cửa hàng
        </h3>
        <span className="text-sm text-gray-500 italic">
          Cập nhật lần cuối: 24/10/2025
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {policies.map((p, idx) => (
          <div
            key={idx}
            className="group p-5 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-green-50 transition">
                {p.icon}
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 group-hover:text-green-600 transition">
                  {p.title}
                </h4>
                <p className="text-sm text-gray-500">{p.short}</p>
              </div>
            </div>

            <ul className="list-disc list-inside text-gray-600 space-y-1 pl-2">
              {p.details.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
