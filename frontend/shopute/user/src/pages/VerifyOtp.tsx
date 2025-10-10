// src/pages/VerifyOtp.tsx
import { FC, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { verifyRegisterOtp } from "../store/authSlice";

const BOX_COUNT = 6;

const VerifyOtp: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();
  const { loading, error, pendingRegToken } = useSelector((s: any) => s.auth);

  // Nếu không có regToken (vào thẳng trang hoặc F5), đưa về Register
  useEffect(() => {
    if (!pendingRegToken) navigate("/register", { replace: true });
  }, [pendingRegToken, navigate]);

  const [otpDigits, setOtpDigits] = useState<string[]>(Array(BOX_COUNT).fill(""));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const setDigit = (index: number, val: string) => {
    setOtpDigits((prev) => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  };

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    if (!digit) {
      setDigit(index, "");
      return;
    }
    setDigit(index, digit);
    if (index < BOX_COUNT - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    const key = e.key;

    if (key === "Backspace") {
      if (otpDigits[index]) {
        setDigit(index, "");
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
        setDigit(index - 1, "");
      }
      e.preventDefault();
    }

    if (key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
      e.preventDefault();
    }
    if (key === "ArrowRight" && index < BOX_COUNT - 1) {
      inputsRef.current[index + 1]?.focus();
      e.preventDefault();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!text) return;

    const next = Array(BOX_COUNT).fill("");
    for (let i = 0; i < Math.min(text.length, BOX_COUNT); i++) {
      next[i] = text[i];
    }
    setOtpDigits(next);

    const lastFilled = Math.min(text.length, BOX_COUNT) - 1;
    if (lastFilled >= 0) inputsRef.current[lastFilled]?.focus();
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingRegToken) return;

    const otp = Number(otpDigits.join(""));
    if (otp.toString().length !== BOX_COUNT) return;

    const res = await dispatch(verifyRegisterOtp({ regToken: pendingRegToken, otp }));
    if (verifyRegisterOtp.fulfilled.match(res)) {
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-green-50">
      <div className="grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl shadow-lg overflow-hidden w-[900px] mt-2 mb-2">
        {/* Left Side */}
        <div className="flex flex-col items-center justify-center p-10 bg-green-100">
          <img
            src="/img/background-laptop.png"
            alt="Background-Laptop-Study"
            className="w-full max-w-[1200px] h-auto"
          />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            LAPTOP-UTESHOP
          </h2>
          <p className="text-gray-600 text-center max-w-xs">
            Experience Performance and Reliability with LAPTOP-UTESHOP"
          </p>
        </div>

        {/* Right Side */}
        <div className="flex flex-col justify-center p-6">
          <h2 className="text-2xl font-bold mb-2 text-center text-gray-700">
            Verify <span className="text-green-600">OTP</span>
          </h2>

          <form onSubmit={handleVerify}>
            <label className="text-gray-700 text-sm mb-2 block text-center">
              Enter the 6-digit OTP
            </label>

            {/* 6 ô nhập OTP */}
            <div className="mb-3 grid grid-cols-6 gap-2">
              {otpDigits.map((val, idx) => (
                <input
                  key={idx}
                  ref={(el) => { inputsRef.current[idx] = el; }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={val}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  onPaste={idx === 0 ? handlePaste : undefined}
                  className="w-full h-12 border rounded-lg text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              ))}
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-600 text-sm mb-2 text-center">{error}</p>
            )}

            {/* Verify button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-900 transition mb-2 disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center mb-2">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="px-2 text-gray-500 text-sm">or</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>

          {/* Link to Login */}
          <p className="text-sm text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-green-600 font-medium hover:underline"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
