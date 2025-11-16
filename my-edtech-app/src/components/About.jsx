import aboutImg from "../assets/about.png"; // your illustration image
import { Link } from "react-router-dom";

export default function About() {
  return (
    
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">

      {/* Main Container */}
      <div className="bg-white shadow-xl rounded-3xl p-10 max-w-6xl w-full">

        {/* Header Title */}
        <h1 className="text-4xl font-bold text-center text-gray-800">About Us</h1>

        {/* Subtitle */}
        <p className="text-center text-gray-600 mt-2 text-lg">
          Empowering Learners Through Flexible and Interactive Online Education
        </p>

        {/* Center line */}
        <div className="w-20 h-1 bg-gray-300 mx-auto my-4 rounded-full"></div>

        {/* Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10 items-center">

          {/* Left Illustration */}
          <div className="flex justify-center">
            <img
              src={aboutImg}
              alt="Online learning illustration"
              className="w-[90%] max-w-sm"
            />
          </div>

          {/* Right Text */}
          <div>
            <p className="text-gray-700 leading-relaxed mb-4">
              At <span className="font-semibold">EdTech</span>, we are transforming the way people learn online by 
              offering flexible, weekend-focused classes tailored for busy learners. Whether you are 
              a student, a professional, or someone eager to acquire new skills, our platform provides 
              a seamless and enriching educational experience.
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              Our expertly crafted programs feature interactive sessions led by experienced educators, 
              high-quality study materials, and collaborative learning activities. With a focus on 
              convenience, quality, and engagement, we empower you to achieve your goals without 
              compromising your daily commitments. Join us and unlock your true potential in today’s 
              competitive world.
            </p>

            {/* Button */}
            <Link
              to="/courses"
              className="inline-block bg-orange-500 text-white px-6 py-2 rounded-full font-medium hover:bg-orange-600 transition"
            >
              Explore
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
