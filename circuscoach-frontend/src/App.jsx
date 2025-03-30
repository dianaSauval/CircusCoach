import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CoursesPage from "./pages/CoursesPage";
import CourseDetail from "./pages/CourseDetail";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CreateCourse from "./pages/admin/CreateCourse";
import EditCourse from "./pages/admin/EditCourse";
import ManageFormations from "./pages/admin/ManageFormations";
import Header from "./components/Header";
import Footer from "./components/Footer";
import RequireAuth from "./components/RequireAuth";
import './assets/styles/variables.css' 
import "./assets/styles/App.css";
import FormationDetails from "./pages/FormationDetails";
import MyCourses from "./pages/MyCourses";
import MyCourseDetail from "./pages/MyCourseDetail";
import FormationPage from "./pages/FormationPage";
import ScrollToTop from "./components/ScrollToTop";
import BioRocioGarrote from "./pages/BioRocioGarrote";
import Register from "./pages/Register";
import RegisterSuccess from "./pages/RegisterSuccess";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ManageCourses from "./pages/admin/ManageCourses";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="app-container">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cursos" element={<CoursesPage />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/mis-cursos" element={<MyCourses />} />
          <Route path="/mis-cursos/:id" element={<MyCourseDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/registro-exitoso" element={<RegisterSuccess />} />
          <Route path="/olvidaste-tu-contraseña" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/formaciones" element={<FormationPage />}/>
          <Route path="/nosotros" element={<BioRocioGarrote />}/>

          {/* Protegemos las rutas de administración */}
          <Route element={<RequireAuth />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/create" element={<CreateCourse />} />
            <Route path="/admin/edit/:id" element={<EditCourse />} />
            <Route path="/admin/formaciones-online" element={<ManageFormations />} />
            <Route path="/admin/cursos" element={<ManageCourses />} />
          </Route>

          {/* ⛔ Esta debe ir al final para no interferir con otras rutas */}
          <Route path="/:slug" element={<FormationDetails />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
