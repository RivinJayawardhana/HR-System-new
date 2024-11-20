import React from "react";
import { Link } from "react-router-dom";

export default function SellerFormSuccess() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between p-6 md:p-12">
      {/* Left Side: Headline, Tagline, and Button */}
      <div className="w-full md:w-1/2 mb-8 md:mb-0" data-aos="fade-up">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 font-sans">
          We'll Contact you{" "}
          <span className="text-purple-600">Soon!</span>
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Stay informed with the latest announcements and updates & Use the
          below form to submit your deatails and get to work with us.
        </p>

        <Link to="/">
          <button
            // Scroll to the form when clicked
            className="bg-purple-700 text-white px-6 py-3 rounded-lg shadow hover:bg-purple-900 text-lg"
          >
            Return
          </button>
        </Link>
      </div>

      {/* Right Side: Image */}
      <div
        className="w-full md:w-1/2 flex justify-center md:justify-end"
        data-aos="slide-right"
      >
        <img
          src="/img/order.png" // Replace with your image URL
          alt="Support illustration"
          className="w-3/4 h-auto object-cover"
        />
      </div>
    </div>
  );
}
