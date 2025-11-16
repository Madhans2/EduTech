import { useForm } from "react-hook-form";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/authSlice";
import { useNavigate, Link } from "react-router-dom";
import loginImg from "../assets/login.png"; // your left-side image

export default function Login() {
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("/api/users/login", data);
      dispatch(setUser(res.data));
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6">

      {/* LEFT IMAGE */}
      <div className="hidden md:flex w-1/2 justify-center">
        <img src={loginImg} alt="login art" className="w-[85%]" />
      </div>

      {/* RIGHT LOGIN CARD */}
      <div className="w-full md:w-1/2 flex justify-center">
        <div className="bg-white shadow-lg border rounded-2xl px-10 py-10 w-[380px]">

          <h1 className="text-3xl font-semibold text-center text-orange-500 mb-6">
            Login
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* USERNAME */}
            <div>
              <label className="text-sm font-medium text-gray-700">Username</label>
              <input
                {...register("email")}
                type="text"
                placeholder="Enter username"
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
                placeholder="Enter password"
                className="w-full px-4 py-2 border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>

            {/* FORGET PASSWORD */}
            <p className="text-right text-orange-500 text-sm cursor-pointer hover:underline">
              Forgot password?
            </p>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-2 rounded-lg font-medium hover:bg-orange-600"
            >
              Login
            </button>
          </form>

          {/* SIGN UP LINK */}
          <p className="text-center text-gray-500 mt-4 text-sm">
            Don’t have an account?{" "}
            <Link to="/register" className="text-orange-500 hover:underline">
              Sign Up
            </Link>
          </p>

          {/* BACK HOME */}
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-orange-500 text-sm hover:underline"
            >
              ← Back Home
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
