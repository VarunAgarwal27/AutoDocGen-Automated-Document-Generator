import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginUser } from "../src/api";
import { useEffect } from "react";
import { useToast } from "../components/ToastContext";

export default function Login() {
  const {showToast} = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({
  email: "",
  password: "",
});
  const handleChange = (e) => {
  setForm({ ...form, [e.target.name]: e.target.value });
};
  const handleSubmit = async (e) => {
  e.preventDefault();

  console.log("LOGIN DATA:", form);

  try {
    const res = await loginUser({
      email: form.email,
      password: form.password,
    });

    // 🔥 Save token
    localStorage.setItem("token", res.access_token);

    showToast("Login successful!", "success");

    // 🚀 Redirect
    navigate("/dashboard");

  } catch (err) {
    console.error(err);
    showToast("Invalid credentials", "error");
  }
};
  useEffect(() => {
  const token = localStorage.getItem("token");

  if (token) {
    navigate("/dashboard");
  }
}, []);
  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center overflow-hidden">

      {/* Glow Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute w-[600px] h-[600px] bg-pink-500 opacity-30 rounded-full blur-[150px] top-[-150px] left-[-150px] animate-pulse"></div>
        <div className="absolute w-[600px] h-[600px] bg-blue-500 opacity-30 rounded-full blur-[150px] bottom-[-150px] right-[-150px] animate-pulse"></div>
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-10 w-full max-w-md shadow-xl"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-white">
          Welcome Back 👋
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="px-4 py-3 rounded-lg bg-black/50 border border-gray-700 focus:outline-none focus:border-blue-500 text-white"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="px-4 py-3 rounded-lg bg-black/50 border border-gray-700 focus:outline-none focus:border-blue-500 text-white"
          />

          <button className="mt-4 py-3 bg-blue-500 rounded-lg hover:bg-blue-600 transition duration-300">
            Login
          </button>

        </form>

        <p className="text-gray-400 text-sm text-center mt-6">
          Don’t have an account?{" "}
          <span onClick={() => navigate("/register")} className="text-blue-400 cursor-pointer hover:underline">
            Register
          </span>
        </p>
      </motion.div>

    </div>
  );
}