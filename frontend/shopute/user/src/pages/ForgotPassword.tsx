import { FC, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { sendOtp, verifyOtp, resetPassword } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

const ForgotPassword: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // ✅ thêm state này
  const [passwordError, setPasswordError] = useState<string | null>(null); // ✅ để hiển thị lỗi

  const handleSendOtp = async () => {
    if (!email.trim()) {
      alert("Vui lòng nhập email!");
      return;
    }
    const result = await dispatch(sendOtp(email));
    if (sendOtp.fulfilled.match(result)) setStep(2);
  };

  const handleVerifyOtp = async () => {
    const result = await dispatch(verifyOtp({ email, otp }));
    if (verifyOtp.fulfilled.match(result)) {
      setResetToken(result.payload);
      setStep(3);
    }
  };

  const handleResetPassword = async () => {
    // ✅ kiểm tra hai mật khẩu trùng khớp
    if (newPassword !== confirmPassword) {
      setPasswordError("Mật khẩu nhập lại không khớp!");
      return;
    }

    setPasswordError(null); // xóa lỗi cũ nếu có

    const result = await dispatch(resetPassword({ resetToken, newPassword }));
    if (resetPassword.fulfilled.match(result)) {
      alert(result.payload);
      navigate("/");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-[400px]">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">
          Forgot Password
        </h2>

        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 mb-4 border rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={handleSendOtp}
              className="w-full bg-green-600 text-white py-3 rounded-lg"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full p-3 mb-4 border rounded-lg"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              onClick={handleVerifyOtp}
              className="w-full bg-green-600 text-white py-3 rounded-lg"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <input
              type="password"
              placeholder="Enter new password"
              className="w-full p-3 mb-4 border rounded-lg"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm new password"
              className="w-full p-3 mb-4 border rounded-lg"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {passwordError && (
              <p className="text-red-500 text-sm mb-3">{passwordError}</p>
            )}

            <button
              onClick={handleResetPassword}
              className="w-full bg-green-600 text-white py-3 rounded-lg"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </>
        )}

        {error && <p className="text-red-500 mt-3 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
