import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Result from "./pages/Result";
import { ToastProvider } from "./components/ToastContext";

function App() {
  return (
    <ToastProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={ <ProtectedRoute> <Dashboard /> </ProtectedRoute>} />
        <Route path="/result" element={<Result />} />
      </Routes>
    </BrowserRouter>
    </ToastProvider>
  );
}

export default App;