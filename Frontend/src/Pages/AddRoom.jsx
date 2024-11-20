import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";

export default function AddRoom() {
  const [formData, setFormData] = useState({
    roomno: "",
    roomtype: "",
    furnished: false,
    gender: "",
    price: "",
    bookingstatus: false,
    slug:""
  });
  const [publishError, setPublishError] = useState(null);
  const navigate = useNavigate();
  console.log(formData);

  const handleChange = (e) => {
    if (
      e.target.id === "Single" ||
      e.target.id === "Double" ||
      e.target.id === "Triple"
    ) {
      setFormData({
        ...formData,
        roomtype: e.target.id,
      });
    }

    if (e.target.id === "Male" || e.target.id === "Female") {
      setFormData({
        ...formData,
        gender: e.target.id,
      });
    }

    if (e.target.id === "furnished") {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/rooms/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), 
      });

      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      if (res.ok) {
        setPublishError(null);
        navigate(`/room-page`);
      }
    } catch (error) {
      setPublishError("Something went wrong");
      console.error(error);
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Add Room</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 ml-3 p-2 sm:flex-row justify">
          <TextInput
            type="text"
            placeholder="Room-no"
            required
            id="roomno"
            className="flex flex-col gap-2 justify-between"
            onChange={(e) =>
              setFormData({ ...formData, roomno: e.target.value })
            }
          />
          <TextInput
            type="number"
            placeholder="Price"
            id="price"
            className="flex flex-col gap-2 justify-center"
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
          />
        </div>
        <div className="gap-2 items-start sm:flex-row p-2 m-3">
          <Select
            onChange={(e) =>
              setFormData({ ...formData, roomtype: e.target.value })
            }
          >
            {" "}
            <option value="Select Room Type">Select Room Type</option>
            <option value="Single">Single Room</option>
            <option value="Double">Double Room</option>
            <option value="Triple">Triple Room</option>
          </Select>
        </div>

        <div className="gap-2 items-start sm:flex-row border rounded-lg p-2 m-3">
          <label className="gap-2">Furnish Status</label>
          <div className="flex  items-start gap-3 p-1 m-1">
           
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="furnished"
                name="furnishStatus"
                className="w-5"
                onChange={() => setFormData({ ...formData, furnished: true })}
                checked={formData.furnished === true}
              />
              <span>Furnished</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="unfurnished"
                name="furnishStatus"
                className="w-5"
                onChange={() => setFormData({ ...formData, furnished: false })}
                checked={formData.furnished === false}
              />
              <span>Unfurnished</span>
            </div>
          </div>
        </div>
        <div className="gap-2 items-start sm:flex-row border rounded-lg p-2 m-3">
          <label className="mb-4">Select Gender</label>
          <div className=" gap-4">
            <div className=" items-center gap-2 p-2">
              <input
                type="checkbox"
                id="Male"
                className="w-5 mt-3 gap-4"
                onChange={handleChange}
                checked={formData.gender === "Male"}
              />
              <span className="ml-2">Male</span>
            </div>

            <div className=" items-center p-2 gap-2">
              <input
                type="checkbox"
                id="Female"
                className="w-5 gap-4"
                onChange={handleChange}
                checked={formData.gender === "Female"}
              />
              <span className="ml-2">Female</span>
            </div>
          </div>
        </div>

        <Button type="submit" className="bg-slate-400 ">
          Add Room
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
