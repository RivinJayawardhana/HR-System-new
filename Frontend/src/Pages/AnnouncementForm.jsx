import React, { useState } from 'react';
import { Button, Label, Select, Textarea, TextInput, FileInput } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';


export default function AnnouncementForm() {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('/api/announcement/create_announcement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Specify that the content is JSON
        },
        body: JSON.stringify(formData), // Convert formData to JSON string
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log('Announcement created successfully:', result);
  
        // Optionally reset form after submission
        setFormData({
          title: '',
          category: '',
          description: '',
        });
  
        alert('Announcement created successfully');
        navigate("/dashboard?tab=announcement"); // Navigate to the announcements tab
      } else {
        console.error('Failed to create announcement');
        alert('Error creating announcement');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error occurred while creating announcement');
    }
  };
  

  return (
    <div className="max-w-lg mx-auto p-5 shadow-md rounded-lg bg-white dark:bg-gray-800">
      <h1 className="text-xl font-semibold mb-5 mt-10">Create Announcement</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mt-5">

        {/* Title Input */}
        <div>
          <Label htmlFor="title" value="Title" />
          <TextInput
            id="title"
            name="title"
            placeholder="Enter announcement title"
            required
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        {/* Category Select */}
        <div>
          <Label htmlFor="category" value="Category" />
          <Select
            id="category"
            name="category"
            required
            value={formData.category}
            onChange={handleChange}
          >
            <option value="" disabled>Select a category</option>
            <option value="Rooms">Rooms</option>
            <option value="Food">Food</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Inventory">Inventory</option>
            <option value="Finance">Finance</option>
            <option value="Other">Other</option>
          </Select>
        </div>

        {/* Description Input */}
        <div>
          <Label htmlFor="description" value="Description" />
          <Textarea
            id="description"
            name="description"
            placeholder="Enter announcement description"
            required
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        

        {/* Submit Button */}
        <Button type="submit" className="w-full bg-purple-700 hover:bg-purple-800">
          Create Announcement
        </Button>
      </form>
    </div>
  );
}
