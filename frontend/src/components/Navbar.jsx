import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <div className="w-full flex justify-between items-center px-10 py-6 backdrop-blur-md bg-white/5 border-b border-white/10">
      
      {/* LOGO (HOME REDIRECT) */}
      <h1
        onClick={() => navigate("/")}
        className="text-xl font-semibold cursor-pointer hover:opacity-80 transition"
      >
        AutoDocGen
      </h1>

    </div>
  );
}