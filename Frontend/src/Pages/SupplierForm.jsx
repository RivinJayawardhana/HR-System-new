import React, { useState, useRef, useEffect } from 'react';
import { Button, Label, TextInput, Textarea, Checkbox } from 'flowbite-react';
import AOS from 'aos'; // Import AOS
import 'aos/dist/aos.css'; // Import AOS CSS
import { Navigate, useNavigate } from 'react-router-dom';
import SellerFormSuccess from './SellerFormSuccess';

export default function SupplierForm() {
  const formRef = useRef(null);
  const navigate = useNavigate();

  // Function to handle scroll to the form section
  const scrollToForm = () => {
    formRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const [formData, setFormData] = useState({
    supplierName: '',
    supplierRegisterNo: '',
    dateOfRegistration: '',
    businessAddress: '',
    contactNumber: '',
    email: '',
    productCategories: [],
  });

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration
      once: true, // Whether animation should happen only once
    });
  }, []);

  // Handle change in text inputs and checkboxes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle checkboxes
    if (type === 'checkbox') {
      setFormData((prevFormData) => ({
        ...prevFormData,
        productCategories: checked
          ? [...prevFormData.productCategories, value]
          : prevFormData.productCategories.filter((category) => category !== value),
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/supplier/create_supplier', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
       navigate('/seller-form-success')
      } else {
        alert('Failed to create supplier request');
      }
    } catch (error) {
      console.error('Error creating supplier account:', error);
      alert('Error creating supplier account');
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row items-center justify-between p-6 md:p-12">
        {/* Left Side: Headline, Tagline, and Button */}
        <div className="w-full md:w-1/2 mb-8 md:mb-0" data-aos="fade-up">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 font-sans">
            Welcome to the Hostel <span className="text-purple-600">Supplier Program!</span>
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            Stay informed with the latest announcements and updates & Use the below form to submit 
            your deatails and get to work with us.
          </p>

          <button
            onClick={scrollToForm}  // Scroll to the form when clicked
            className="bg-purple-700 text-white px-6 py-3 rounded-lg shadow hover:bg-purple-900 text-lg"
          >
            Become a Supplier
          </button>
        </div>

        {/* Right Side: Image */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end" data-aos="slide-right">
          <img
            src="/img/order.png" // Replace with your image URL
            alt="Support illustration"
            className="w-3/4 h-auto object-cover"
          />
        </div>
      </div>

      {/* Supplier Registration Form */}
      <div className="max-w-lg mx-auto p-5 shadow-md rounded-lg bg-white" ref={formRef}>
        <h1 className="text-xl font-semibold mb-5">Supplier Registration</h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Supplier Name */}
          <div>
            <Label htmlFor="supplierName" value="Supplier Name" />
            <TextInput
              id="supplierName"
              name="supplierName"
              required
              value={formData.supplierName}
              onChange={handleChange}
              placeholder="Enter supplier name"
            />
          </div>

          {/* Supplier Register No */}
          <div>
            <Label htmlFor="supplierRegisterNo" value="Supplier Register NO" />
            <TextInput
              id="supplierRegisterNo"
              name="supplierRegisterNo"
              required
              value={formData.supplierRegisterNo}
              onChange={handleChange}
              placeholder="Enter register number"
            />
          </div>

          {/* Date Of Registration */}
          <div>
            <Label htmlFor="dateOfRegistration" value="Date Of Registration" />
            <TextInput
              id="dateOfRegistration"
              name="dateOfRegistration"
              type="date"
              required
              value={formData.dateOfRegistration}
              onChange={handleChange}
            />
          </div>

          {/* Business Address */}
          <div>
            <Label htmlFor="businessAddress" value="Business Address" />
            <Textarea
              id="businessAddress"
              name="businessAddress"
              required
              value={formData.businessAddress}
              onChange={handleChange}
              placeholder="Enter business address"
            />
          </div>

          {/* Contact Number */}
          <div>
            <Label htmlFor="contactNumber" value="Contact Number" />
            <TextInput
              id="contactNumber"
              name="contactNumber"
              type="tel"
              required
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="Enter contact number"
            />
          </div>

          {/* Email Address */}
          <div>
            <Label htmlFor="email" value="Email Address" />
            <TextInput
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
            />
          </div>

          {/* Product Categories */}
          <div>
            <Label value="Product Categories" />
            <div className="space-y-2">
              <div className="flex items-center">
                <Checkbox
                  id="furniture"
                  name="productCategories"
                  value="Furniture"
                  onChange={handleChange}
                  checked={formData.productCategories.includes('Furniture')}
                />
                <Label htmlFor="furniture" className="ml-2">
                  Furniture
                </Label>
              </div>

              <div className="flex items-center">
                <Checkbox
                  id="food"
                  name="productCategories"
                  value="Food & beverages"
                  onChange={handleChange}
                  checked={formData.productCategories.includes('Food & beverages')}
                />
                <Label htmlFor="food" className="ml-2">
                  Food & Beverages
                </Label>
              </div>

              <div className="flex items-center">
                <Checkbox
                  id="electric"
                  name="productCategories"
                  value="Electric & technology"
                  onChange={handleChange}
                  checked={formData.productCategories.includes('Electric & technology')}
                />
                <Label htmlFor="electric" className="ml-2">
                  Electric & Technology
                </Label>
              </div>

              <div className="flex items-center">
                <Checkbox
                  id="cleaning"
                  name="productCategories"
                  value="Cleaning & maintaining"
                  onChange={handleChange}
                  checked={formData.productCategories.includes('Cleaning & maintaining')}
                />
                <Label htmlFor="cleaning" className="ml-2">
                  Cleaning & Maintaining
                </Label>
              </div>

              <div className="flex items-center">
                <Checkbox
                  id="other"
                  name="productCategories"
                  value="Other"
                  onChange={handleChange}
                  checked={formData.productCategories.includes('Other')}
                />
                <Label htmlFor="other" className="ml-2">
                  Other
                </Label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full bg-purple-700 hover:bg-purple-800" onClick={<SellerFormSuccess/>}>
            Submit Application
          </Button>
        </form>

      </div>
    </>
  );
}
