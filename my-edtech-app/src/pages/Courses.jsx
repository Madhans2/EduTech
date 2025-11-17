import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useSelector(state => state.auth);

  const categories = ['All', 'Web Development', 'Design', 'Business', 'Marketing', 'Photography', 'Music'];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get('https://edutech-irck.onrender.com/api/courses', {
          params: { search, category: category === 'All' ? '' : category }
        });
        setCourses(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [search, category]);

  const enroll = async (courseId) => {
    try {
      await axios.post(`https://edutech-irck.onrender.com/api/courses/${courseId}/enroll`, {}, { withCredentials: true });
      alert('Enrolled successfully!');
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to enroll');
    }
  };

  if (loading) return <div className="text-center py-10">Loading courses...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">All <span className='text-orange-500'> Courses </span></h1>

      {/* Search & Filter */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {courses.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">No courses found.</p>
        ) : (
          courses.map(course => {
            const isEnrolled = course.enrolledStudents?.some(id => id.toString() === user?._id);
            const avgRating = course.ratings.length > 0
              ? (course.ratings.reduce((a, b) => a + b.rating, 0) / course.ratings.length).toFixed(1)
              : 'No ratings';

            return (
              <div key={course._id} className="card hover:shadow-lg transition-shadow">
                <Link to={`/courses/${course._id}`}>
                  <img
                    src={course.thumbnail || 'https://via.placeholder.com/300x180'}
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-t-xl"
                  />
                </Link>
                <div className="p-4">
                  <Link to={`/courses/${course._id}`}>
                    <h3 className="font-semibold text-lg text-gray-800 hover:text-blue-600 line-clamp-2">
                      {course.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-600 mt-1">by {course.instructor?.name || 'Instructor'}</p>

                  <div className="flex items-center mt-2">
                    <span className="text-yellow-500 font-medium">{avgRating}</span>
                    <span className="text-gray-500 text-sm ml-1">
                      ({course.ratings.length} {course.ratings.length === 1 ? 'review' : 'reviews'})
                    </span>
                  </div>

                  <div className="mt-4">
                    {isEnrolled ? (
                      <Link
                        to={`/courses/${course._id}`}
                        className="w-full btn-primary text-center block text-sm py-2"
                      >
                        Continue Learning
                      </Link>
                    ) : (
                      <button
                        onClick={() => enroll(course._id)}
                        className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm"
                      >
                        Enroll for Free
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}