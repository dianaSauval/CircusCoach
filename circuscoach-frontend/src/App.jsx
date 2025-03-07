import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import CreateCourse from "./pages/CreateCourse";
import EditCourse from "./pages/EditCourse";
import Header from "./components/Header";
import Footer from "./components/Footer";
import RequireAuth from "./components/RequireAuth";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protegemos las rutas de administración */}
        <Route element={<RequireAuth />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/create" element={<CreateCourse />} />
          <Route path="/admin/edit/:id" element={<EditCourse />} />
        </Route>
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;



