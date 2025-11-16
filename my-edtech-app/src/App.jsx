import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuth } from './hooks/useAuth'; // ADD THIS
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import About from './components/About';
import Footer from './components/Footer';
import CreateCrourse from './pages/CreateCourse';
import AddLesson from './pages/AddLesson';

function App() {
  useAuth(); // ADD THIS LINE

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="//create-course" element={<CreateCrourse />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/courses/:courseId/add-lesson" element={<AddLesson />} />

      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;