import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser, logout } from '../redux/authSlice';
import axios from 'axios';

export const useAuth = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('https://edutech-jmi4.onrender.com/api/users/me', { withCredentials: true });
        dispatch(setUser(res.data));
      } catch (err) {
        dispatch(logout());
      }
    };

    checkAuth();
  }, [dispatch]);
};