import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (!user?._id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');

        // Fetch the logged-in user to get enrolled courses and progress
        const userRes = await axios.get('/api/users/me', { withCredentials: true });
        const enrolledIds = userRes.data.enrolledCourses || [];

        if (enrolledIds.length === 0) {
          setCourses([]);
          setLoading(false);
          return;
        }

        // Fetch course details for each enrolled course
        const coursePromises = enrolledIds.map(async (courseId) => {
          try {
            const courseRes = await axios.get(`/api/courses/${courseId}`, { withCredentials: true });
            const course = courseRes.data.course;
            if (!course) return null;

            const totalLessons = course.lessons?.length || 0;
            const completedLessons = course.progress?.completedLessons?.length || 0;
            const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

            return {
              ...course,
              completed: completedLessons,
              total: totalLessons,
              progressPercent,
            };
          } catch (err) {
            console.error('Course fetch error:', err);
            return null;
          }
        });

        const fetchedCourses = (await Promise.all(coursePromises)).filter(Boolean);
        setCourses(fetchedCourses);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError('Failed to load courses. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-600 py-10">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        My <span className="text-orange-500">Dashboard</span>
      </h1>
      <p className="text-gray-600 mb-8">Continue learning where you left off</p>

      {courses.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-gray-500 mb-4">No enrolled courses yet.</p>
          <Link to="/courses" className="btn-primary inline-block">
            Explore Courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((course) => (
            <Link
              key={course._id}
              to={`/courses/${course._id}`}
              className="card hover:shadow-lg transition-shadow rounded-xl overflow-hidden"
            >
              <img
                src={course.thumbnail || 'https://via.placeholder.com/300x180'}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-800 line-clamp-2 mb-1">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  by {course.instructor?.name || 'Instructor'}
                </p>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>
                      {course.completed} / {course.total} lessons
                    </span>
                    <span>{course.progressPercent}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${course.progressPercent}%` }}
                    ></div>
                  </div>
                </div>

                <p className="text-sm font-medium text-blue-600">Continue →</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
