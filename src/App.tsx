import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./components/Login";
import Board from "./pages/Board";
import Header from "./components/layout/Headerr";
import ProtectedRoute from "./components/ProtectedRoute";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header /> 
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/dashboard" element={<ProtectedRoute><Board /></ProtectedRoute>} />

          <Route path="/" element={<Navigate to="/login" replace />} /> 
          
          <Route path="*" element={<Navigate to="/login" replace />} /> 
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;