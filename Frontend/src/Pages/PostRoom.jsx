import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Alert } from "flowbite-react";
import { FaChair } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

export default function PostRoom() {
  const { roomSlug } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({
    visible: false,
    message: "",
  });
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/rooms/getrooms?slug=${roomSlug}`);

        if (!res.ok) {
          const errorMessage = await res.text();
          setError(errorMessage);
          setLoading(false);
          return;
        }

        const data = await res.json();
        if (data.rooms.length === 0) {
          setError("Room not found");
          setLoading(false);
          return;
        }

        setRoom(data.rooms[0]);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomSlug]);

  const showNotification = (message) => {
    setNotification({ visible: true, message });
    setTimeout(() => {
      setNotification({ visible: false, message: "" });
    }, 3000);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <Alert color="failure">{error}</Alert>;
  }

  const handleBooking = async (room) => {
    if (!user) {
      showNotification("Please log in to book a room.");
      return;
    }

    if (!room) {
      showNotification("Room data is missing.");
      return;
    }

    try {
      const bookingData = {
        userId: user._id, // You can change this if user is not logged in
        email: user.email,
        username: user.username,
        bookingstatus: room.bookingstatus,
        furnished: room.furnished,
        roomtype: room.roomtype,
        gender: room.gender,
        roomno: room.roomno,
        price: room.price,
        slug: room.slug,
      };

      const res = await fetch("/api/bookings/addbooking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        if (res.status === 409) {
          throw new Error("ALREADY BOOKING REQUEST ADDED!");
        }
        throw new Error(errorData.message || "Failed to book room.");
      }

      const savedBooking = await res.json();
      showNotification("Booking Request Added successfully!");
    } catch (error) {
      console.error(error);
      showNotification(error.message || "An error occurred while booking.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6 relative">
      {notification.visible && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
          {notification.message}
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-2xl relative">
        <div className="absolute top-4 left-4 bg-blue-700 text-white text-lg font-bold py-2 px-4 rounded-lg shadow-lg">
          RNO {room.roomno}
        </div>

        <div className="flex flex-col items-center text-center pt-16 space-y-8">
          {/* Room Type */}
          <h2 className="text-4xl font-bold text-blue-700">
            Room Type : <span className="font-bold"> {room.roomtype} Room</span>
          </h2>

          {/* Room Status */}

          <div
            className={`text-2xl font-semibold ${
              room.bookingstatus ? "text-red-600" : "text-blue-600"
            }`}
          >
            <span>{room.bookingstatus ? "RESERVED" : "AVAILABLE"}</span>
          </div>

          {/* Furnished/Unfurnished Status */}
          <div
            className={`flex items-center justify-center px-6 py-3 font-semibold text-xl rounded-full ${
              room.furnished
                ? "bg-blue-100 text-blue-800"
                : "bg-red-100 text-red-600"
            }`}
          >
            <FaChair className="text-3xl mr-3" />
            <span>{room.furnished ? "FURNISHED" : "UNFURNISHED"}</span>
          </div>

          {/* Gender Badge */}
          <div className="flex items-center justify-center">
            <h2 className="text-2xl text-gray-700">
              Gender:{" "}
              <span
                className={`inline-block px-4 py-1 text-lg font-semibold rounded-full ${
                  room.gender === "Male"
                    ? "bg-blue-200 text-blue-800"
                    : "bg-pink-200 text-pink-800"
                }`}
              >
                {room.gender}
              </span>
            </h2>
          </div>

          {/* Price */}
          <div className="flex items-center">
            <span className="text-4xl font-bold text-gray-900">
              Rs. {room.price}.00
            </span>
          </div>

          {/* Book Button */}
          <button
            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-10 py-3 rounded-full text-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300"
            onClick={() => handleBooking(room)}
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
