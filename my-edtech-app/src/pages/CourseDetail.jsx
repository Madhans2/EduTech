import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completedLessons, setCompletedLessons] = useState([]);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!id || id === "undefined") {
      navigate("/courses");
      return;
    }

    const loadCourse = async () => {
      try {
        const res = await axios.get(`https://edutech-irck.onrender.com/api/courses/${id}`, {
          withCredentials: true,
        });

        const courseData = res.data.course;
        setCourse(courseData);

        // Set existing completed lessons
        setCompletedLessons(courseData.completedLessons || []);

        if (courseData.lessons?.length > 0) {
          setSelectedLesson(courseData.lessons[0]);
        }
      } catch (err) {
        console.error(err);
        navigate("/courses");
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [id, navigate]);

  if (loading) return <div className="text-center p-6">Loading course...</div>;
  if (!course) return <div className="text-center p-6">Course not found</div>;

  const isEnrolled = course.enrolledStudents?.some(
    (student) => student.toString() === user?._id
  );

  const isOwner =
    user?.role === "instructor" &&
    course.instructor?._id?.toString() === user?._id;

  const enroll = async () => {
    try {
      await axios.post(
        `/api/courses/${id}/enroll`,
        {},
        { withCredentials: true }
      );
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to enroll");
    }
  };

  const markComplete = async (lessonId) => {
    if (completedLessons.includes(lessonId)) return; // avoid duplicates

    try {
      await axios.post(
        "/api/courses/progress",
        { courseId: id, lessonId },
        { withCredentials: true }
      );

      // update UI instantly
      setCompletedLessons((prev) => [...prev, lessonId]);
    } catch (err) {
      console.log("Progress update failed", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">

        {/* VIDEO PLAYER FIXED */}
        {selectedLesson?.videoUrl ? (
          <>
            <p className="text-sm text-gray-400 mb-2 break-all">
              Video URL: {selectedLesson.videoUrl}
            </p>

            <video
              src={selectedLesson.videoUrl}
              controls
              preload="auto"
              className="w-full rounded-lg bg-black"
              crossOrigin="anonymous"
              onError={(e) => console.log("HTML5 video error:", e)}
              onTimeUpdate={(e) => {
                const video = e.target;

                if (!video.duration) return;

                const played = video.currentTime / video.duration;

                if (played > 0.9 && isEnrolled) {
                  markComplete(selectedLesson._id);
                }
              }}
            >
              Your browser does not support video.
            </video>
          </>
        ) : (
          <div className="h-96 bg-gray-200 flex items-center justify-center rounded-xl">
            <p className="text-gray-500">Video not available</p>
          </div>
        )}

        <h1 className="text-3xl font-bold mt-4">{course.title}</h1>
        <p className="text-gray-600 mt-2">{course.description}</p>
        <p className="text-sm text-gray-500 mt-1">
          Instructor: {course.instructor?.name}
        </p>
      </div>

      {/* LESSON LIST */}
      <div>
        <div className="p-4 border rounded-xl shadow-sm">
          <h3 className="font-bold mb-3">
            Lessons ({course.lessons?.length || 0})
          </h3>

          {course.lessons?.length === 0 ? (
            <p className="text-gray-500">No lessons yet</p>
          ) : (
            course.lessons.map((lesson) => {
              const isCurrent = selectedLesson?._id === lesson._id;
              const isCompleted = completedLessons.includes(lesson._id);

              return (
                <div
                  key={lesson._id}
                  onClick={() => setSelectedLesson(lesson)}
                  className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
                    isCurrent ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex justify-between">
                    <span>
                      {lesson.title}{" "}
                      {isCompleted && (
                        <span className="text-green-600 text-xs ml-2">
                          ✔ Completed
                        </span>
                      )}
                    </span>

                    {lesson.isFree && (
                      <span className="text-xs text-green-600">Free</span>
                    )}
                  </div>
                </div>
              );
            })
          )}

          {!isEnrolled && (
            <button
              onClick={enroll}
              className="w-full mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Enroll for Free
            </button>
          )}

          {isOwner && (
            <Link
              to={`/courses/${course._id}/add-lesson`}
              className="block w-full mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg text-center hover:bg-blue-700"
            >
              + Add Lesson
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
