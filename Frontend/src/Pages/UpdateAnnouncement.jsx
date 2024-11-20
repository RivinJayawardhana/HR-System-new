import React, { useEffect, useState } from "react";
import { Alert, Button, Select, Textarea, TextInput } from "flowbite-react";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateAnnouncement() {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
  });
  const [publishError, setPublishError] = useState(null);
  const { id } = useParams(); // Get the ID from the URL params
  const navigate = useNavigate();

  // Fetch relevant announcement using id
  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const res = await fetch(`/api/announcement/get_a_announcement/${id}`); // Fetching the announcement by ID
        const data = await res.json();
        if (!res.ok) {
          console.error(res);
        } else {
          setFormData(data); // Pre-populate the form with announcement data
        }
      } catch (error) {
        console.error("Error fetching the announcement:", error);
      }
    };

    fetchAnnouncement();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/announcement/update_announcement/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Send updated form data
      });

      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      setPublishError(null);
      alert("Announcement updated successfully!");
      navigate("/dashboard?tab=announcement"); // Navigate back to announcements page
    } catch (error) {
      console.error(error);
      setPublishError("Something went wrong");
    }
  };

  return (
    <div className="p-3 mx-auto">
      <h1 className="text-center text-3xl my-7 font-semibold">Update Announcement</h1>
      <form className="flex max-w-3xl flex-col mx-auto pb-10" onSubmit={handleSubmit}>
        <div className="flex flex-col justify-center">
          {/* Title */}
          <label className="font-semibold">Title</label>
          <TextInput
            type="text"
            required
            id="title"
            name="title"
            className="p-2 mb-2"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter announcement title"
          />

          {/* Category */}
          <label className="font-semibold">Category</label>
          <Select
            id="category"
            name="category"
            required
            className="p-2 mb-2"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="" disabled>
              Select a category
            </option>
            <option value="Rooms">Rooms</option>
            <option value="Food">Food</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Inventory">Inventory</option>
            <option value="Finance">Finance</option>
            <option value="Other">Other</option>
          </Select>

          {/* Description */}
          <label className="font-semibold">Description</label>
          <Textarea
            id="description"
            name="description"
            required
            className="p-2 mb-2"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter announcement description"
          />

          
        </div>

        <Button type="submit" className="bg-purple-700 hover:bg-purple-800 p-2 rounded-lg text-white">
          Update Announcement
        </Button>

        {publishError && (
          <Alert className="mt-5" color="failure">
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
}
