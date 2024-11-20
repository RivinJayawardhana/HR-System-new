import { Button, Label, Select, Textarea, TextInput } from 'flowbite-react';
import { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import 'aos/dist/aos.css';

export default function Support() {
    const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    userid: currentUser._id,
    studentId: '',
    studentName: '',
    email: '',
    issueType: '',
    title: '',
    description: '',
  });

  console.log(currentUser._id)
  // Create a ref for the form section
  const formRef = useRef(null);

  // Function to handle scroll to the form section
  const scrollToForm = () => {
    formRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('api/ticket/create_ticket', {
        method: 'POST', // Set the method to POST
        headers: {
          'Content-Type': 'application/json', // Set the content type to JSON
        },
        body: JSON.stringify(formData), // Convert the form data to a JSON string
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Ticket created successfully:', data);
        // Optionally, reset form fields after successful submission
        setFormData({
          studentId: '',
          studentName: '',
          email: '',
          issueType: '',
          title: '',
          description: '',
        });
        alert('Ticket created successfully');
      } else {
        const errorData = await response.json();
        console.error('Error creating ticket:', errorData);
        alert('Error creating ticket. Please try again.');
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Network error. Please try again later.');
    }
  };
  

  return (
    <>
      <div className="flex flex-col md:flex-row items-center justify-between p-6 md:p-12">
        {/* Left Side: Headline, Tagline, and Button */}
        <div className="w-full md:w-1/2 mb-8 md:mb-0" data-aos="fade-up">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 font-sans">
            Welcome to the Hostel <span className='text-purple-600'>Help Desk!</span>
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            Stay informed with the latest announcements and updates & Use the ticket system to submit 
            your inquiries and get the support you need.
          </p>

          <button
            onClick={scrollToForm}  // Scroll to the form when clicked
            className="bg-purple-700 text-white px-6 py-3 rounded-lg shadow hover:bg-purple-900 text-lg"
          >
            Raise a Ticket
          </button>
        </div>

        {/* Right Side: Image */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end" data-aos="slide-right">
          <img
            src="/img/hostel.png" // Replace with your image URL
            alt="Support illustration"
            className="max-w-full h-auto object-cover"
          />
        </div>
      </div>

      {/* Form Section */}
      <div ref={formRef} className='w-2/4 mx-auto mt-20'>
        <h1 className='text-xl font-semibold mb-5 pt-10'>Submit your ticket here</h1>
        <form onSubmit={handleSubmit} className="space-y-4 pb-5">
    
          <div>
            <Label htmlFor="studentId" value="Student ID" />
            <TextInput
              id="studentId"
              name="studentId"
              placeholder="Enter your student ID"
              required
              value={formData.studentId}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="studentName" value="Student Name" />
            <TextInput
              id="studentName"
              name="studentName"
              placeholder="Enter your full name"
              required
              value={formData.studentName}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="email" value="Email" />
            <TextInput
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="issueType" value="Issue Type" />
            <Select
              id="issueType"
              name="issueType"
              required
              value={formData.issueType}
              onChange={handleChange}
            >
              <option value="" disabled>Select an issue type</option>
              <option value="Rooms">Rooms</option>
              <option value="Food">Food</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Inventory">Inventory</option>
              <option value="Finance">Finance</option>
              <option value="Other">Other</option>
            </Select>
          </div>

          <div>
            <Label htmlFor="title" value="Title" />
            <TextInput
              id="title"
              name="title"
              placeholder="Enter the issue title"
              required
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="description" value="Description" />
            <Textarea
              id="description"
              name="description"
              placeholder="Describe your issue in detail"
              required
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
            Submit Ticket
          </Button>
        </form>
      </div>
    </>
  );
}
