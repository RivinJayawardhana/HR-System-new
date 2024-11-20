import { Alert, Spinner } from "flowbite-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CleaningRequestForm = () => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    roomNumber: "",
    date: "",
    additionalDetails: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    // Handle form submission

    if (
      !formData.name ||
      !formData.email ||
      !formData.roomNumber ||
      !formData.date
    ) {
      return setError("Please Fill all Fields");
    }

    try {
      setLoading(true);
      setError(false);
      const res = await fetch("/api/request/place_clean_req", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log(data);
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
        return;
      }
      navigate("/request-success");
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-4 font-sans">
          Place a cleaning request
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 p-4 mt-5">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          {/* Room Number */}
          <div>
            <label
              htmlFor="roomNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Room Number
            </label>
            <input
              type="text"
              id="roomNumber"
              name="roomNumber"
              value={formData.roomNumber}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          {/* Date */}
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700"
            >
              Request Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          {/* Additional Details */}
          <div>
            <label
              htmlFor="additionalDetails"
              className="block text-sm font-medium text-gray-700"
            >
              Additional Details
            </label>
            <textarea
              id="additionalDetails"
              name="additionalDetails"
              value={formData.additionalDetails}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              rows="4"
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="flex justify-between items-center">
            <button
              disabled={loading}
              type="submit"
              className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600"
            >
              {loading ? (
                            <>
                                <Spinner size='sm' />
                                <span className="pl-3">Loading</span>
                            </>
                        ) : 'Submit Request'}
            </button>
            <button
              type="button"
              disabled={loading}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              onClick={() =>
                setFormData({
                  name: "",
                  email: "",
                  roomNumber: "",
                  date: "",
                  additionalDetails: "",
                })
              }
            >
              Reset
            </button>
          </div>
        </form>
        <div className="text-red-600">
                    {error && (
                        <Alert className="mt-5" color="failure">
                            {error}
                        </Alert>
                    )}
                </div>

        {/* Payment Link Info (Optional Based on UI) */}
        <p className="text-sm text-gray-500 mt-4">
          Request for cleaning services based on availability. Your request will
          be processed within 48 hours.
        </p>
      </div>
    </div>
  );
};

export default CleaningRequestForm;
