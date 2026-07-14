import { useState, useEffect } from "react";
import { createProject, cloneRepo, uploadZip, analyzeProject } from "../src/api";
import { useNavigate } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import { useToast } from "../components/ToastContext";
export default function Dashboard() {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [repoUrl, setRepoUrl] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/projects/my`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = async () => {
    if (!repoUrl && !file) {
      showToast("Provide GitHub URL or upload ZIP", "error");
      return;
    }

    setLoading(true);

    try {
      const project = await createProject({
        name: repoUrl
          ? repoUrl.split("/").pop()
          : file?.name || "Uploaded Project",
        repo_url: repoUrl.trim() !== "" ? repoUrl : null,
      });

      const projectId = project.project_id;

      if (repoUrl) {
        await cloneRepo(projectId);
      } else {
        await uploadZip(projectId, file);
      }

      await analyzeProject(projectId);

      const docsRes = await fetch(
        `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/projects/${projectId}/docs`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const docs = await docsRes.json();

      navigate("/result", { state: { docs, projectId } });
    } catch (err) {
      console.error(err);
      showToast("Error processing project", "error");
    } finally {
      setLoading(false);
    }
  };

  // ⛔ LOADING SCREEN (cleaned)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0F19] text-white">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-indigo-400 animate-pulse">
            Generating Documentation...
          </p>
        </div>
      </div>
    );
  }

  return (

  <div className="relative min-h-screen bg-black text-white overflow-hidden px-6 py-10">
    {/* BACKGROUND */}
    <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90 z-0" />

    {/* GLOW */}
    <div className="absolute inset-0 z-10">
      <div className="absolute w-[500px] h-[500px] bg-pink-500 opacity-25 rounded-full blur-[140px] top-[-120px] left-[-120px] animate-pulse"></div>
      <div className="absolute w-[500px] h-[500px] bg-blue-500 opacity-25 rounded-full blur-[140px] bottom-[-120px] right-[-120px] animate-pulse"></div>
    </div>

    {/* CONTENT WRAPPER */}
    <div className="relative z-20 max-w-5xl mx-auto flex flex-col items-center gap-12">

      {/* ===== GENERATOR CARD ===== */}
      <div className="w-full max-w-2xl">

        <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-10 shadow-2xl hover:scale-[1.01] transition duration-300">

          {/* TITLE */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
              Generate Documentation 🚀
            </h1>

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
              className="text-gray-300 text-sm"
            />
          </div>

          {/* INPUT */}
          <input
            type="text"
            placeholder="Paste GitHub Repository URL"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            className="w-full px-4 py-3 mb-5 rounded-xl bg-black/40 border border-white/10
            text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
          />

          {/* OR */}
          <p className="text-center text-gray-500 text-xs uppercase tracking-widest mb-5">
            or
          </p>

          {/* FILE */}
          <input
            type="file"
            accept=".zip"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full mb-6 text-gray-400"
          />

          {/* BUTTON */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-500 hover:bg-blue-600
            transition duration-300 font-medium shadow-lg shadow-blue-500/20
            hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "Generate Documentation"}
          </button>

          {/* LOADING */}
          {loading && (
            <p className="text-center mt-5 text-blue-400 animate-pulse text-sm">
              AI is analyzing your project...
            </p>
          )}

        </div>
      </div>

      {/* ===== HISTORY SECTION (SEPARATE PANEL) ===== */}
      <div className="w-full max-w-4xl">

        <h2 className="text-lg font-semibold text-gray-300 mb-6 text-center">
          Your Projects 🧾
        </h2>

        {projects?.length === 0 && (
          <p className="text-center text-gray-500">
            No projects yet — generate your first documentation 🚀
          </p>
        )}

        <div className="grid md:grid-cols-2 gap-4">

          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() =>
                navigate("/result", {
                  state: {
                    docs: project.docs,
                    projectId: project.id,
                  },
                })
              }
              className="cursor-pointer backdrop-blur-lg bg-white/5 border border-white/10
              rounded-xl p-5 hover:border-white/20 hover:scale-[1.02]
              hover:shadow-lg hover:shadow-blue-500/10
              transition duration-300"
            >

              <div className="flex justify-between items-center">

                <h3 className="font-semibold text-white truncate">
                  {project.name}
                </h3>

                <span className="text-xs text-gray-400">
                  #{project.id}
                </span>

              </div>

              <p className="text-gray-400 text-sm mt-2 truncate">
                {project.repo_url || "Uploaded ZIP Project"}
              </p>

            </div>
          ))}

        </div>
      </div>

    </div>
  </div>
);
}
