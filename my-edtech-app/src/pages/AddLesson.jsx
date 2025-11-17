import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AddLesson() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [isFree, setIsFree] = useState(false);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!video) {
      setError('Please select a video');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('isFree', isFree);
    formData.append('video', video);

    try {
      await axios.post(`https://edutech-irck.onrender.com/api/courses/${courseId}/lessons`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      alert('Lesson added!');
      navigate(`/courses/${courseId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add lesson');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 card mt-10">
      <h2 className="text-2xl font-bold mb-6">Add New Lesson</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Lesson Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isFree"
            checked={isFree}
            onChange={(e) => setIsFree(e.target.checked)}
          />
          <label htmlFor="isFree">Make this lesson free (preview)</label>
        </div>

        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideo(e.target.files[0])}
          className="w-full"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full btn-primary ${loading ? 'opacity-70' : ''}`}
        >
          {loading ? 'Uploading...' : 'Add Lesson'}
        </button>
      </form>

      <button
        onClick={() => navigate(`/courses/${courseId}`)}
        className="mt-4 text-blue-600 hover:underline"
      >
        ← Back to Course
      </button>
    </div>
  );
}