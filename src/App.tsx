import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import Login from "./components/Login";
import Board from "./pages/Board";
import Header from "./components/layout/Headerr";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateProject from "./components/CreateProject";
import CreateTask from "./components/CreateTask";
import Home from "./pages/Home";

const App: React.FC = () => {
  const handleProjectCreated = (projectId: string) => {
    console.log("პროექტი შეიქმნა ID-ით:", projectId);
  };

  const handleTaskCreated = (taskId: string) => {
    console.log("Task შეიქმნა ID-ით:", taskId);
  };

  const handleOpenChange = (open: boolean) => {
    console.log("კომპონენტის ხილვადობა შეიცვალა:", open);
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Board />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/create-project"
            element={
              <ProtectedRoute requireAdmin={true}>
                <CreateProject 
                  onProjectCreated={handleProjectCreated} 
                  open={false} 
                  onOpenChange={handleOpenChange} 
                />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/create-task"
            element={
              <ProtectedRoute requireAdmin={true}>
                <CreateTask 
                  onTaskCreated={handleTaskCreated} 
                  onOpenChange={handleOpenChange} 
                  open={false} 
                  projectId="" 
                />
              </ProtectedRoute>
            }
          />
          
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;