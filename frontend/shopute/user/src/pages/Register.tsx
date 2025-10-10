// src/pages/Register.tsx
import { FC, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../store/authSlice";

const Register: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();
  const { loading, error } = useSelector((s: any) => s.auth);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    const res = await dispatch(registerUser(form));
    if (registerUser.fulfilled.match(res)) {
      navigate("/verify-otp");
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
          {/* Tiêu đề ở giữa phía trên */}
          <h2 className="text-2xl font-bold mb-2 text-center text-gray-700">
            Laptop <span className="text-green-600">Store</span>
          </h2>

          <form onSubmit={onSubmit}>
            {/* First name */}
            <label className="text-gray-700 text-sm mb-1">First name</label>
            <input
              name="firstName"
              type="text"
              placeholder="First name"
              className="w-full p-2 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              value={form.firstName}
              onChange={onChange}
              required
            />
            {/* Last name */}
            <label className="text-gray-700 text-sm mb-1">Last name</label>
            <input
              name="lastName"
              type="text"
              placeholder="Last name"
              className="w-full p-2 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              value={form.lastName}
              onChange={onChange}
              required
            />

            {/* Email */}
            <label className="text-gray-700 text-sm mb-1">Email</label>
            <input
              name="email"
              type="email"
              placeholder="email"
              className="w-full p-2 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              value={form.email}
              onChange={onChange}
              required
            />
            {/* Phone Number */}
            <label className="text-gray-700 text-sm mb-1">Phone Number</label>
            <input
              name="phone"
              type="tel"
              placeholder="Phone Number"
              className="w-full p-2 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              value={form.phone}
              onChange={onChange}
              required
            />

            {/* Password */}
            <label className="text-gray-700 text-sm mb-1">Password</label>
            <input
              name="password"
              type="password"
              placeholder="********"
              className="w-full p-2 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              value={form.password}
              onChange={onChange}
              required
            />

            {/* Confirm Password */}
            <label className="text-gray-700 text-sm mb-1">Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              placeholder="********"
              className="w-full p-2 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              value={form.confirmPassword}
              onChange={onChange}
              required
            />

            {/* Error */}
            {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

            {/* Sign up button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-900 transition mb-2 disabled:opacity-60"
            >
              {loading ? "Sending OTP..." : "Create account"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center mb-2">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="px-2 text-gray-500 text-sm">or</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>

          <button className="flex items-center justify-center gap-2 border py-3 rounded-lg hover:bg-gray-100 transition">
            <img
              src="https://cdn-icons-png.flaticon.com/512/300/300221.png"
              alt="Google"
              className="w-5 h-5"
            />
            Sign in with Google
          </button>

          {/* Link to Login */}
          <p className="text-sm text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-green-600 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
