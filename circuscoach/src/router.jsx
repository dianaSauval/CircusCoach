import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Recomended from "./pages/Recomended";
import AdminUpload from "./pages/AdminUpload";
import Login from "./pages/Login";
import Checkout from "./pages/Checkout";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/recomended" element={<Recomended />} />
        <Route path="/admin/upload" element={<AdminUpload />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
