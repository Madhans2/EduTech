import { useForm } from "react-hook-form";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/authSlice";
import { useNavigate, Link } from "react-router-dom";
import loginImg from "../assets/login-bro.png"; // same illustration as login page

export default function Register() {
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("https://edutech-jmi4.onrender.com/api/users/register", data, {
        withCredentials: true,
      });
      dispatch(setUser(res.data));
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6">

      {/* LEFT ILLUSTRATION IMAGE */}
      <div className="hidden md:flex w-1/2 justify-center">
        <img src={loginImg} alt="register art" className="w-[85%]" />
      </div>

      {/* RIGHT SIGNUP CARD */}
      <div className="w-full md:w-1/2 flex justify-center">
        <div className="bg-white shadow-lg border rounded-2xl px-10 py-10 w-[380px]">

          <h1 className="text-3xl font-semibold text-center text-orange-500 mb-6">
            Sign Up
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* NAME */}
            <div>
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <input
                {...register("name")}
                type="text"
                placeholder="Your full name"
                className="w-full px-4 py-2 border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                {...register("email")}
                type="email"
                placeholder="Enter email"
                className="w-full px-4 py-2 border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input
                {...register("password")}
                type="password"
                placeholder="Create password"
                className="w-full px-4 py-2 border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>

            {/* ROLE */}
            <div>
              <label className="text-sm font-medium text-gray-700">Role</label>
              <select
                {...register("role")}
                className="w-full px-4 py-2 border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option value="student">Student</option>
                {/* Add instructor if needed */}
              </select>
            </div>

            {/* SIGN UP BUTTON */}
            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-2 rounded-lg font-medium hover:bg-orange-600"
            >
              Sign Up
            </button>
          </form>

          {/* LOGIN LINK */}
          <p className="text-center text-gray-500 mt-4 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-orange-500 hover:underline">
              Login
            </Link>
          </p>

          {/* BACK HOME */}
          <div className="mt-6 text-center">
            <Link to="/" className="text-orange-500 text-sm hover:underline">
              ← Back Home
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
