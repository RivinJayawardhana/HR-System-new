import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

export default function RequestSuccessPage() {
  useEffect(() => {
    AOS.init({ duration: 1000, easing: "ease-out", once: true });
  }, []);

  return (
    <div className="w-full flex flex-col lg:flex-row items-center gap-10 justify-evenly px-4 py-8">
      {/* Left side with text */}
      <div className="lg:w-1/2 text-center lg:text-center mb-64">
        <h1 className="text-5xl font-semibold mb-2 font-sans" data-aos="fade-up">
          Your request was submitted successfully!
        </h1>
        <span className="text-gray-600" data-aos="fade-down">We'll contact you back soon</span><br />

        <Link to='/'>
        
          <button className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 mt-10" data-aos="ease-in">
            Return
          </button>
        </Link>
      </div>

      {/* Right side with image */}
      <div className="lg:w-1/2 flex justify-center lg:justify-end">
        <img
          className="max-w-full h-auto"
          src="/img/success.png"
          alt="Success Image"
        />
      </div>
    </div>
  );
}
