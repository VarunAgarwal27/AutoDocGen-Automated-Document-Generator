import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { registerUser } from "../src/api";
import { useEffect } from "react";
import { useToast } from "../components/ToastContext";

export default function Register() {
  const { showToast } = useToast(); 
  const navigate = useNavigate();
  const [form, setForm] = useState({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});
const handleChange = (e) => {
  setForm({ ...form, [e.target.name]: e.target.value });
};
const handleSubmit = async (e) => {
  e.preventDefault();

  console.log("FORM DATA:", form);
  if (form.password !== form.confirmPassword) {
    showToast("Passwords do not match", "error");
    return;
  }

  try {
    const res = await registerUser({
      name: form.name,
      email: form.email,
      password: form.password,
    });

    console.log(res);
    showToast("Registered successfully! PLease login.", "success");
    navigate("/login");
  } catch (err) {
    console.error(err);
    showToast("Error registering", "error");
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

      {/* Glow Background (same as login) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute w-[600px] h-[600px] bg-pink-500 opacity-30 rounded-full blur-[150px] top-[-150px] left-[-150px] animate-pulse"></div>
        <div className="absolute w-[600px] h-[600px] bg-blue-500 opacity-30 rounded-full blur-[150px] bottom-[-150px] right-[-150px] animate-pulse"></div>
      </div>

      {/* Register Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-10 w-full max-w-md shadow-xl"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-white">
          Create Account 🚀
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <input
            type="text"
            name="name"
            placeholder="name"
            onChange={handleChange}
            className="px-4 py-3 rounded-lg bg-black/50 border border-gray-700 focus:outline-none focus:border-pink-500 text-white"
          />

          <input
            type="email"
            name="email"
            placeholder="email"
            onChange={handleChange}
            className="px-4 py-3 rounded-lg bg-black/50 border border-gray-700 focus:outline-none focus:border-pink-500 text-white"
          />

          <input
            type="password"
            name="password"
            placeholder="password"
            onChange={handleChange}
            className="px-4 py-3 rounded-lg bg-black/50 border border-gray-700 focus:outline-none focus:border-pink-500 text-white"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
            className="px-4 py-3 rounded-lg bg-black/50 border border-gray-700 focus:outline-none focus:border-pink-500 text-white"
          />

          <button className="mt-4 py-3 bg-pink-500 rounded-lg hover:bg-pink-600 transition duration-300">
            Register
          </button>

        </form>

        <p className="text-gray-400 text-sm text-center mt-6">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")} className="text-pink-400 cursor-pointer hover:underline">
            Login
          </span>
        </p>
      </motion.div>

    </div>
  );
}

