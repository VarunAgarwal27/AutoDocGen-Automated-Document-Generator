import { useLocation } from "react-router-dom";
import { useToast } from "../components/ToastContext";

export default function Result() {
  const { showToast } = useToast();
  const location = useLocation();
  const docs = location.state?.docs;
  const projectId = location.state?.projectId;

  let parsedDocs = null;

try {
  parsedDocs = JSON.parse(docs?.documentation);
} catch (e) {
  console.error("Invalid JSON:", docs?.documentation);
}
  const downloadFile = async (format) => {
  try {
    const base_url = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
    const res = await fetch(
      `${base_url}/projects/${projectId}/export?format=${format}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const blob = await res.blob();

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `documentation.${format}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (err) {
    console.error(err);
    showToast("Download failed", "error");
  }
};

  return (
  <div className="relative min-h-screen bg-black text-white overflow-hidden p-10">

    {/* Background Gradient */}
    <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90 z-0" />

    {/* Glow Layer (same theme as Landing/Dashboard) */}
    <div className="absolute inset-0 z-10">
      <div className="absolute w-[500px] h-[500px] bg-pink-500 opacity-20 rounded-full blur-[150px] top-[-120px] left-[-120px] animate-pulse"></div>
      <div className="absolute w-[500px] h-[500px] bg-blue-500 opacity-20 rounded-full blur-[150px] bottom-[-120px] right-[-120px] animate-pulse"></div>
    </div>

    {/* Main Container */}
    <div className="relative z-20 max-w-5xl mx-auto">

      {/* HEADER */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
          Generated Documentation 📄
        </h1>
        <p className="text-gray-400 text-sm mt-2">
          AI-generated structured overview of your project
        </p>
      </div>

      {/* DOWNLOAD BAR */}
      <div className="flex justify-center gap-4 mb-10 flex-wrap">

        <button
          onClick={() => downloadFile("pdf")}
          className="px-5 py-2 rounded-lg bg-red-500 hover:bg-red-600 transition shadow-lg hover:scale-105"
        >
          Download PDF 📄
        </button>

        <button
          onClick={() => downloadFile("docx")}
          className="px-5 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition shadow-lg hover:scale-105"
        >
          Download DOCX 📝
        </button>

      </div>

      {/* DOCUMENT CARD */}
      <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl space-y-10">

        {parsedDocs ? (
          <>
            {/* SYSTEM PURPOSE */}
            <section>
              <h2 className="text-xl font-semibold text-blue-400 mb-2">
                System Purpose
              </h2>
              <p className="text-gray-300 leading-relaxed">
                {parsedDocs.system_purpose}
              </p>
            </section>

            {/* TECH STACK */}
            <section>
              <h2 className="text-xl font-semibold text-purple-400 mb-2">
                Tech Stack
              </h2>
              <ul className="space-y-1 text-gray-300">
                {Object.entries(parsedDocs.tech_stack).map(([key, val]) => (
                  <li key={key}>
                    <span className="text-white font-medium">{key}:</span>{" "}
                    {val.length ? val.join(", ") : "Not implemented"}
                  </li>
                ))}
              </ul>
            </section>

            {/* MODULES */}
            <section>
              <h2 className="text-xl font-semibold text-pink-400 mb-3">
                Modules
              </h2>

              <div className="space-y-4">
                {parsedDocs.modules.map((m, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-black/30 border border-white/10 hover:border-white/20 transition"
                  >
                    <h3 className="font-semibold text-white">{m.name}</h3>
                    <p className="text-gray-300 text-sm mt-1">
                      {m.responsibility}
                    </p>
                    <p className="text-gray-500 text-xs mt-2">
                      Files: {m.files.join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* API ROUTES */}
            <section>
              <h2 className="text-xl font-semibold text-blue-300 mb-3">
                API Routes
              </h2>

              <div className="space-y-3">
                {parsedDocs.api_routes.map((api, i) => (
                  <div key={i} className="text-gray-300">
                    <p>
                      <span className="text-white font-semibold">
                        {api.method}
                      </span>{" "}
                      <span className="text-blue-300">{api.route}</span>
                    </p>
                    <p className="text-gray-500 text-sm">
                      {api.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* DATA FLOW */}
            <section>
              <h2 className="text-xl font-semibold text-purple-300 mb-2">
                Data Flow
              </h2>
              <ul className="list-disc ml-6 text-gray-300 space-y-1">
                {parsedDocs.data_flow.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </section>

            {/* ARCHITECTURE */}
            <section>
              <h2 className="text-xl font-semibold text-pink-300 mb-2">
                Architecture
              </h2>
              <p className="text-gray-300 leading-relaxed">
                {parsedDocs.architecture}
              </p>
            </section>

            {/* SECURITY */}
            <section>
              <h2 className="text-xl font-semibold text-blue-300 mb-2">
                Security
              </h2>
              <ul className="list-disc ml-6 text-gray-300 space-y-1">
                {parsedDocs.security.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </section>

            {/* IMPROVEMENTS */}
            <section>
              <h2 className="text-xl font-semibold text-purple-300 mb-2">
                Improvements
              </h2>
              <ul className="list-disc ml-6 text-gray-300 space-y-1">
                {parsedDocs.improvements.map((imp, i) => (
                  <li key={i}>{imp}</li>
                ))}
              </ul>
            </section>
          </>
        ) : (
          <p className="text-gray-400 text-center">No documentation found</p>
        )}
      </div>
    </div>
  </div>
);
}
