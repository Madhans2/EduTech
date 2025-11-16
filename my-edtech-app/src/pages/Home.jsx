import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import heroImg from "../assets/home.png";
import About from "../components/About";

export default function Home() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-6 pt-10">

      {/* HERO SECTION */}
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center py-10">

        {/* LEFT CONTENT */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-semibold text-gray-800 leading-snug">
            Welcome,{" "}
            <span className="text-orange-500">
              {isAuthenticated ? user.name : "Login"}
            </span>
          </h1>

          <p className="text-gray-500 max-w-md">
            What We Actually doing is that we teach people with Live Session and
            We provide multiple online sessions for people to clear their Doubts...
          </p>

          <Link
            to="/courses"
            className="bg-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-600 inline-block"
          >
            Explore
          </Link>
        </div>

        {/* RIGHT IMAGE */}
        <div className="flex justify-center">
          <img
            src={heroImg}
            alt="Learning Illustration"
            className="w-[420px] md:w-[500px]"
          />
        </div>
      </div>

      <About />

    </div>
  );
}
