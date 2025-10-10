import { useState } from "react";
import { userApi } from "../../apis/user";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"password" | "otp">("password");

  // Gửi yêu cầu đổi mật khẩu → nhận OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Mật khẩu mới và xác nhận không khớp!");
      return;
    }
    try {
      await userApi.changePassword({
        currentPassword, // ✅ đúng key
        newPassword,
      });
      alert("OTP đã được gửi. Vui lòng kiểm tra email!");
      setStep("otp");
    } catch (err) {
      console.error("Yêu cầu OTP thất bại:", err);
      alert("Yêu cầu OTP thất bại!");
    }
  };

  // Xác nhận OTP
  const handleConfirmOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await userApi.confirmChangePassword({ otp, newPassword });
      alert("Đổi mật khẩu thành công!");
      // reset state
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setOtp("");
      setStep("password");
    } catch (err) {
      console.error("Xác thực OTP thất bại:", err);
      alert("OTP không đúng hoặc đã hết hạn!");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-8">
      <h1 className="text-2xl font-semibold text-gray-700 border-b pb-4 mb-6">
        Đổi mật khẩu
      </h1>

      {step === "password" && (
        <form onSubmit={handleRequestOtp} className="space-y-5 max-w-md">
          <div>
            <label className="block text-sm">Mật khẩu hiện tại</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm">Mật khẩu mới</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm">Xác nhận mật khẩu mới</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-500 transition"
          >
            Gửi OTP
          </button>
        </form>
      )}

      {step === "otp" && (
        <form onSubmit={handleConfirmOtp} className="space-y-5 max-w-md">
          <div>
            <label className="block text-sm">Nhập OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-500 transition"
            >
              Xác nhận OTP
            </button>
            <button
              type="button"
              onClick={() => setStep("password")}
              className="flex-1 px-6 py-2 bg-gray-400 text-white rounded hover:bg-gray-300 transition"
            >
              Hủy
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
