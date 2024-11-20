import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import queryString from "query-string";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/cart/cartSlice";
import { FaBed, FaChair } from "react-icons/fa";

export default function RoomPage() {
  const location = useLocation();
  const { roomtype } = queryString.parse(location.search);
  const [rooms, setRooms] = useState([]);
  const [totalRooms, setTotalRooms] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(roomtype || "");
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [notification, setNotification] = useState({
    visible: false,
    message: "",
  });
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.currentUser);

  const categories = ["All", "Single", "Double", "Triple"];

  useEffect(() => {
    fetchRooms();
  }, [currentPage, searchTerm, selectedCategory, selectedPriceRange]);

  const fetchRooms = async () => {
    try {
      const res = await fetch(
        `/api/rooms/getrooms?searchTerm=${searchTerm}&page=${currentPage}&roomtype=${selectedCategory}&priceRange=${selectedPriceRange}`
      );
      const data = await res.json();
      if (res.ok) {
        setRooms(data.rooms);
        setTotalRooms(data.totalRooms);
        setTotalPages(data.totalPages);
        console.log(data)
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const handleCategoryChange = (rtype) => {
    setSelectedCategory(rtype === "All" ? "" : rtype); // Clear category for 'All'
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handlePriceRangeChange = (range) => {
    setSelectedPriceRange(range);
    setCurrentPage(1); // Reset to first page when filter changes
  };


  const showNotification = (message) => {
    setNotification({ visible: true, message });
    setTimeout(() => {
      setNotification({ visible: false, message: "" });
    }, 3000);
  };


  

  return (
    <div className="container mx-auto py-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold">
          Reserve a room with excelent condtions at Hostel Management
          Application
        </h2>
      </div>

      <div className="flex">
        {/* Sidebar for filters */}
        <aside className="w-1/4 p-4 border-r">
          <h3 className="text-xl font-semibold mb-4">Filters</h3>
          {/* Category Filter */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-2">Room Type</h4>
            <ul>
              {categories.map((rtype) => (
                <li key={rtype}>
                  <button
                    className={`text-left block w-full px-2 py-1 mb-1 rounded ${
                      selectedCategory === rtype
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                    onClick={() => handleCategoryChange(rtype)}
                  >
                    {rtype}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {/* Price Range Filter */}
          <div>
            <h4 className="text-lg font-semibold mb-2">Price Range(RS)</h4>
            <ul>
              {["All", "0-8000", "8000-16000", "16000-25000"].map((range) => (
                <li key={range}>
                  <button
                    className={`text-left block w-full px-2 py-1 mb-1 rounded ${
                      selectedPriceRange === range
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                    onClick={() => handlePriceRangeChange(range)}
                  >
                    {range}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main content */}
        <main className="w-3/4 p-4">
          <div className="mb-4 w-52">
            <input
              type="text"
              placeholder="Search by Room type..."
              className="w-full px-4 py-2 border rounded"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div key={room._id} className="border rounded-lg shadow-lg p-4">
                <Link to={`/room/${room.slug}`}></Link>
                <div className="flex justify-between">
                  <p className="text-blue-800 font-semibold">{`RNO ${room.roomno}`}</p>
                  <p
                    className={`font-bold px-4 py-2 rounded-lg border shadow-inner ${
                      room.gender === "Male"
                        ? "bg-blue-200 text-blue-800 border-blue-500"
                        : "bg-pink-200 text-pink-800 border-pink-500"
                    }`}
                  >
                    {room.gender}
                  </p>
                </div>

                <h3 className=" text-lg font-semibold text-center mb-2">
                  <Link to={`/room/${room.slug}`}>
                    Room Type :{" "}
                    <span className="text-xl">{room.roomtype} </span>Room
                  </Link>
                </h3>

                <div
                  className={`p-2 flex items-center justify-center font-semibold ${
                    room.furnished ? "text-blue-800" : "text-red-600"
                  }`}
                >
                  <FaChair className="text-2xl mr-2" />
                  <span>{room.furnished ? "FURNISHED" : "UNFURNISHED"}</span>
                </div>

                <div
                  className={`items-center justify-center font-cinzel text-xl rounded-lg inline-block my-1 ml-24 px-4 border border-black shadow-inner ${
                    room.bookingstatus ? "text-red-600" : "text-blue-600"
                  }`}
                >
                  <span>{room.bookingstatus ? "RESERVED" : "AVAILABLE"}</span>
                </div>

                <p className="text-center text-gray-600">
                  Price: Rs. {room.price}
                </p>

                <div className="flex justify-center mt-4 space-x-2">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"  >
                  <Link to={`/room/${room.slug}`}>View</Link>
                  </button>
                </div>
                
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="mx-2 px-4 py-2 bg-gray-200 rounded"
            >
              Previous
            </button>
            <span className="mx-2 px-4 py-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="mx-2 px-4 py-2 bg-gray-200 rounded"
            >
              Next
            </button>
          </div>
        </main>
      </div>

      {notification.visible && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white py-2 px-4 rounded">
          {notification.message}
        </div>
      )}
    </div>
  );
}
