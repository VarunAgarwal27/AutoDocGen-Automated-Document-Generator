const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export async function registerUser(data) {
  const response = await fetch(`${BASE_URL}/auth/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Registration Failed");
  }

  return response.json();
}

export async function loginUser(data) {
  const response = await fetch(`${BASE_URL}/auth/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  console.log("LOGIN RESPONSE:", result);

  if (!response.ok) {
    throw new Error(result.detail || "Login failed");
  }

  return result;
}
export async function createProject(data) {
  const token = localStorage.getItem("token");

  const formData = new FormData();
  formData.append("name", data.name);

  if (data.repo_url) {
    formData.append("repo_url", data.repo_url);
  }

  console.log("SENDING DATA:");
  console.log("name:", data.name);
  console.log("repo_url:", data.repo_url);

  const res = await fetch(`${BASE_URL}/projects/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const result = await res.json();
  console.log("CREATE PROJECT RESPONSE:", result);

  if (!res.ok) {
    throw new Error(result.detail || "Create project failed");
  }

  return result;
}

export async function cloneRepo(projectId) {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `${BASE_URL}/projects/github/${projectId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const result = await res.json();
  console.log("CLONE RESPONSE:", result);

  if (!res.ok) {
    throw new Error(result.detail || "Clone failed");
  }

  return result;
}

export async function uploadZip(projectId, file) {
  const token = localStorage.getItem("token");

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(
    `${BASE_URL}/projects/upload/${projectId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  return await res.json();
}

export async function analyzeProject(projectId) {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `${BASE_URL}/projects/${projectId}/analysis`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const result = await res.json();
  console.log("ANALYSIS RESPONSE:", result);

  if (!res.ok) {
    throw new Error(result.detail || "Analysis failed");
  }

  return result;
}
