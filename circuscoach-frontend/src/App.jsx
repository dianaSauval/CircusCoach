import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CreateCourse from "./pages/admin/CreateCourse";
import EditCourse from "./pages/admin/EditCourse";
import ManageFormations from "./pages/admin/ManageFormations";
import ManageModules from "./pages/admin/ManageModules";
import Header from "./components/Header";
import Footer from "./components/Footer";
import RequireAuth from "./components/RequireAuth";

function App() {
  return (
    <Router>
      <div className="app-container">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protegemos las rutas de administración */}
        <Route element={<RequireAuth />}>
          {/* Dashboard de Admin */}
          <Route path="/admin" element={<AdminDashboard />} />

          {/* Gestión de Cursos */}
          <Route path="/admin/create" element={<CreateCourse />} />
          <Route path="/admin/edit/:id" element={<EditCourse />} />

          {/* Gestión de Formaciones */}
          <Route path="/admin/formaciones" element={<ManageFormations />} />
          <Route path="/admin/formaciones/:formationId/modulos" element={<ManageModules />} />
        </Route>
      </Routes>
      <Footer />
      </div>
    </Router>
  );
}

export default App;




