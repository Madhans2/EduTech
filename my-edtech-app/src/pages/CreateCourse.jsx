import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function CreateCourse() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);

    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('category', data.category);

    // Validate file
    if (!data.thumbnail || !data.thumbnail[0]) {
      setError('Please upload a thumbnail');
      setLoading(false);
      return;
    }

    const file = data.thumbnail[0];
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Thumbnail must be JPEG, PNG, or WebP');
      setLoading(false);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Thumbnail must be under 5MB');
      setLoading(false);
      return;
    }

    formData.append('thumbnail', file);

    try {
      await axios.post('/api/courses', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      alert('Course created successfully!');
      reset();
      navigate('/dashboard');
    } catch (err) {
      // Detailed error handling
      const msg = err.response?.data?.message || err.message || 'Failed to create course';
      setError(msg);
      console.error('Create course error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 card mt-10">
      <h2 className="text-2xl font-bold mb-6">Create New Course</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            {...register('title', { required: 'Title is required' })}
            placeholder="Course Title"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <textarea
            {...register('description', { required: 'Description is required' })}
            placeholder="Course Description"
            rows="4"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
        </div>

        <div>
          <select
            {...register('category', { required: 'Select a category' })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Choose Category</option>
            <option>Web Development</option>
            <option>Design</option>
            <option>Business</option>
            <option>Marketing</option>
            <option>Photography</option>
            <option>Music</option>
          </select>
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
        </div>

        <div>
          <input
            {...register('thumbnail', { required: 'Thumbnail is required' })}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="w-full px-4 py-2 border rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {errors.thumbnail && <p className="text-red-500 text-sm mt-1">{errors.thumbnail.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full btn-primary ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Creating...' : 'Create Course'}
        </button>
      </form>
    </div>
  );
}