import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const handleLogout = () => {
  localStorage.removeItem("token");
  navigate("/login");
};
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">

      {/* Gradient Base */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-80 z-0" />

      {/* Glow Layer */}
      <div className="absolute inset-0 z-10">
        <div className="absolute w-[600px] h-[600px] bg-pink-500 opacity-30 rounded-full blur-[150px] top-[-150px] left-[-150px] animate-pulse"></div>

        <div className="absolute w-[600px] h-[600px] bg-blue-500 opacity-30 rounded-full blur-[150px] bottom-[-150px] right-[-150px] animate-pulse"></div>
      </div>

      {/* Header */}
      <header className="relative z-20 w-full flex justify-between items-center px-10 py-6 backdrop-blur-md bg-white/5 border-b border-white/10">
        <h1 className="text-xl font-semibold">AutoDocGen</h1>

        <div className="flex gap-4">

  {!token ? (
    <>
      <button
        onClick={() => navigate("/login")}
        className="px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-800 hover:scale-105 transition duration-300"
      >
        Login
      </button>

      <button
        onClick={() => navigate("/register")}
        className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 hover:scale-105 transition duration-300"
      >
        Get Started
      </button>
    </>
  ) : (
    <>
      <button
        onClick={() => navigate("/dashboard")}
        className="px-4 py-2 bg-purple-500 rounded-lg hover:bg-purple-600 hover:scale-105 transition duration-300"
      >
        Dashboard
      </button>

      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 hover:scale-105 transition duration-300"
      >
        Logout
      </button>
    </>
  )}

</div>
      </header>

      {/* Main Section */}
      <motion.main
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-20 flex flex-1 flex-col items-center justify-center text-center px-6"
      >
        <h2 className="text-5xl md:text-6xl font-bold leading-tight mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
          Generate Documentation <br /> Automatically
        </h2>

        <p className="text-gray-400 max-w-xl mb-8 text-lg">
          AutoDocGen helps you convert your codebase into clean,
          structured, and professional documentation using AI.
        </p>

        <TypeAnimation
          sequence={[
            "Analyse your repository...",
            1500,
            "Generate documentation...",
            1500,
            "Create clean reports...",
            1500,
            "AI is working for you...",
            1500,
          ]}
          wrapper="span"
          speed={50}
          repeat={Infinity}
          className="text-blue-400 text-lg"
        />

        <div className="mt-8 flex gap-4">
          <button onClick={() => navigate("/register")} className="px-6 py-3 bg-blue-500 rounded-lg hover:bg-blue-600 hover:scale-105 transition duration-300">
            Start Free
          </button>

          <button className="px-6 py-3 border border-gray-600 rounded-lg hover:bg-gray-800 hover:scale-105 transition duration-300">
            Learn More
          </button>
        </div>
      </motion.main>

      {/* Features Section */}
      <section className="relative z-20 py-32 px-6 text-center">
        <h3 className="text-3xl font-bold mb-12 text-white">
          Powerful Features ⚡
        </h3>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-5xl mx-auto">

          <motion.div
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.1 }}
  viewport={{ once: true }}
  className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-8 shadow-lg hover:scale-105 transition duration-300"
>
            <h4 className="text-xl font-semibold mb-3 text-blue-400">
              AI Documentation
            </h4>
            <p className="text-gray-400">
              Automatically generate clean and structured docs from your code.
            </p>
          </motion.div>

          <motion.div
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.3 }}
  viewport={{ once: true }}
  className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-8 shadow-lg hover:scale-105 transition duration-300"
>
            <h4 className="text-xl font-semibold mb-3 text-purple-400">
              GitHub Integration
            </h4>
            <p className="text-gray-400">
              Import repositories directly and analyze them instantly.
            </p>
          </motion.div>

          <motion.div
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay:0.5 }}
  viewport={{ once: true }}
  className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-8 shadow-lg hover:scale-105 transition duration-300"
>
            <h4 className="text-xl font-semibold mb-3 text-pink-400">
              Export & Share
            </h4>
            <p className="text-gray-400">
              Download and share documentation in multiple formats.
            </p>
          </motion.div>

        </div>
      </section>

          <motion.section
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
  viewport={{ once: true }}
  className="relative z-20 py-32 px-6 text-center"
>

  <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
    Start Generating Docs in Seconds 🚀
  </h2>

  <p className="text-gray-400 max-w-xl mx-auto mb-10 text-lg">
    Upload your project or connect your GitHub repository and let AI
    generate clean, structured documentation instantly.
  </p>

  <div className="flex justify-center gap-4 flex-wrap">

    <button onClick={() => navigate("/register")} className="px-8 py-4 bg-blue-500 rounded-xl text-lg hover:bg-blue-600 hover:scale-105 transition duration-300 shadow-lg">
      Get Started Free
    </button>

    <button className="px-8 py-4 border border-gray-600 rounded-xl text-lg hover:bg-gray-800 hover:scale-105 transition duration-300">
      View Demo
    </button>

  </div>

</motion.section>

    </div>
  );
}