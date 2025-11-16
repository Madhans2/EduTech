import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword, role });
  const token = generateToken(user._id);

  res.cookie('token', token, { httpOnly: true, secure: false });
  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = generateToken(user._id);
  res.cookie('token', token, { httpOnly: true, secure: false });
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  });
};

export const logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
};

export const getMe = async (req, res) => {
  res.json(req.user);
};