import { Button, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";

export default function DashMyBookingRequests() {
  const { currentUser } = useSelector((state) => state.user);
  const [userBookingRequests, setUserBookingRequests] = useState([]);
  const [completedBookings, setCompleteStatus] = useState([]);
  const [showModel, setShowModel] = useState(false);
  const [bookingIdToDelete, setBookingIdToDelete] = useState("");

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        const res = await fetch(`/api/bookings/getbookings`);
        const data = await res.json();

        if (res.ok) {
          // Filter the bookings based on the current user's email
          const userBookingRequests = data.bookings.filter(
            (booking) => booking.email === currentUser.email
          );

          // Update state
          setUserBookingRequests(userBookingRequests);
          setCompleteStatus(completedBookings);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    // Only fetch bookings if there is a valid currentUser
    if (currentUser?.email) {
      fetchMyBookings();
    }
  }, [currentUser]);

  const handleDeleteMyBooking = async () => {
    setShowModel(false);
    try {
      const res = await fetch(
        `/api/bookings/deletebooking/${bookingIdToDelete}/${currentUser._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserBookingRequests((prev) =>
          prev.filter((booking) => booking._id !== bookingIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar">
      <h1 className="pt-6 pb-5 px-4 font-semibold">My Room Bookings</h1>
      {userBookingRequests.length > 0 ? (
        <Table hoverable className="shadow-md">
          <Table.Head>
            <Table.HeadCell>Date</Table.HeadCell>
            <Table.HeadCell>Room No</Table.HeadCell>
            <Table.HeadCell>Room Type</Table.HeadCell>
            <Table.HeadCell>Gender</Table.HeadCell>
            <Table.HeadCell>Price(RS.)</Table.HeadCell>
            <Table.HeadCell>Furnished Status</Table.HeadCell>
            <Table.HeadCell>Booking Status</Table.HeadCell>
            <Table.HeadCell>Delete</Table.HeadCell>
          </Table.Head>
          {userBookingRequests.map((booking) => (
            <Table.Body className="divide-y" key={booking._id}>
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>
                  {new Date(booking.updatedAt).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>{booking.roomno}</Table.Cell>
                <Table.Cell>{booking.roomtype}</Table.Cell>
                <Table.Cell>{booking.gender}</Table.Cell>
                <Table.Cell>{booking.price}</Table.Cell>
                <Table.Cell>
                  {booking.furnished ? "FURNISHED" : "UNFURNISHED"}
                </Table.Cell>
                <Table.Cell>
                  <span
                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                      booking.bookingstatus
                        ? "bg-blue-100 text-blue-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {booking.bookingstatus ? "Accepted" : "Pending..."}
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <Button
                    color="failure"
                    onClick={() => {
                      setShowModel(true);
                      setBookingIdToDelete(booking._id);
                    }}
                  >
                    Delete
                  </Button>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          ))}
        </Table>
      ) : (
        <p>No bookings available to show</p>
      )}
      <Modal
        show={showModel}
        onClose={() => setShowModel(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-200">
              Are you sure you want to delete this booking?
            </h3>
          </div>
          <div className="flex justify-center gap-4">
            <Button color="failure" onClick={handleDeleteMyBooking}>
              Yes, delete
            </Button>
            <Button color="gray" onClick={() => setShowModel(false)}>
              No, cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
