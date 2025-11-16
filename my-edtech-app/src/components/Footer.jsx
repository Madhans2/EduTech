import { FaGithub, FaLinkedin, FaInstagram, FaGooglePlusG } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white text-gray-800 px-6 py-10 shadow-md">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-6 text-sm">
        {/* About Section */}
        <div>
          <h4 className="font-semibold mb-2">EduTech</h4>
          <ul className="space-y-1">
            <li className="cursor-pointer">Home</li>
            <li className="cursor-pointer">About Us</li>
            <li className="cursor-pointer">Course</li>
            <li className="cursor-pointer">Dashboard</li>
          </ul>
        </div>

        {/* Groups Section */}
        

        {/* Help Section */}
        

        {/* Consumer Policy Section */}
        <div>
          <h4 className="font-semibold mb-2">Contact</h4>
          <ul className="space-y-1">
            <li className="cursor-pointer">Madhan</li>
            <li className="cursor-pointer">Email</li>
            <li className="cursor-pointer">LinkedIn</li>
            <li className="cursor-pointer">Github</li>
          </ul>
        </div>

        {/* Developer Details */}
        <div>
          <h4 className="font-semibold mb-2">Developer Details</h4>
          <ul className="space-y-1">
            <li className="cursor-pointer">Madhan S</li>
            <li className="cursor-pointer">iammadhan28@gmail.com</li>
            <li className="cursor-pointer">Full-Stacker</li>
          </ul>
          <h4 className="font-semibold mt-4 mb-2">Social</h4>
          <div className="flex space-x-3 text-xl cursor-pointer">
            <FaGithub />
            <FaLinkedin />
            <FaInstagram />
            <FaGooglePlusG />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
