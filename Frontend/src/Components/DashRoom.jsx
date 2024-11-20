import { Button, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import {
  HiGift,
  HiOutlineExclamationCircle,
  HiOutlineHome,
} from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import html2pdf from "html2pdf.js";

export default function DashRoom() {
  const { currentUser } = useSelector((state) => state.user);
  const [userRoom, setUserRoom] = useState([]);
  const [showModel, setShowModel] = useState(false);
  const [roomIdToDelete, setRoomIdToDelete] = useState("");
  const [totalRooms, setTotalRooms] = useState(0);
  const [totalSingleRooms, setTotalSingleRooms] = useState(0);
  const [totalDoubleRooms, setTotalDoubleRooms] = useState(0);
  const [totalTripleRooms, setTotalTripleRooms] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch(`/api/rooms/getrooms?searchTerm=${searchTerm}`);
        const data = await res.json();

        if (res.ok) {
          setUserRoom(data.rooms);
          setTotalRooms(data.totalRooms);
          setTotalSingleRooms(data.totalSingleRooms);
          setTotalDoubleRooms(data.totalDoubleRooms);
          setTotalTripleRooms(data.totalTripleRooms);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchRooms();
  }, [searchTerm]);
  const handleDeleteRoom = async () => {
    setShowModel(false);
    try {
      const res = await fetch(
        `/api/rooms/delete/${roomIdToDelete}/${currentUser._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserRoom((prev) =>
          prev.filter((room) => room._id !== roomIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const generatePDFReport = () => {
    const content = `
      <style>
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          padding: 8px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        th {
          background-color: #f2f2f2;
          font-size: 14px; /* Adjust font size */
        }
        td {
          font-size: 12px; /* Adjust font size */
        }
      </style>
      <h1><b>Room Details Report</b></h1>
      
      <p>Total Single Rooms: ${totalSingleRooms}</p>
      <p>Total Double Rooms: ${totalDoubleRooms}</p>
      <p>Total Triple Rooms: ${totalTripleRooms}</p>
      <br>
      <br>
      <table>
        <thead>
          <tr>
            <th>Added Date</th>
            <th>Room No</th>
            <th>Room Type</th>
            <th>Gender</th>
            <th>Price</th>
            <th>Furnished status</th>
          </tr>
        </thead>
        <tbody>
          ${userRoom
            .map(
              (room) => `
            <tr>
              <td>${new Date(room.createdAt).toLocaleDateString()}</td>
              <td>${room.roomno}</td>
              <td>${room.roomtype}</td>
              <td>${room.gender}</td>
              <td>${room.price}</td>
              <td>${room.furnished ? "FURNISHED" : "UNFURNISHED"}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;

    html2pdf()
      .from(content)
      .set({ margin: 1, filename: "room_report.pdf" })
      .save();
  };

  const handleGenerateReport = () => {
    generatePDFReport();
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      <div className=" flex gap-3 justify-start">
        <div className="flex justify-between pb-4">
          <Link to="/addroom">
            <Button
              type="button"
              gradientDuoTone="purpleToBlue"
              className="w-full , text-black bg-slate-400 "
              outline
            >
              Add Rooms
            </Button>
          </Link>
        </div>
        <div className="flex justify-between pb-4">
          <Link to="/dashboard?tab=bookings" key="bookings">
            <Button
              type="button"
              gradientDuoTone="purpleToBlue"
              className="w-full , text-black bg-slate-400 "
              outline
            >
              Booking Requests
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex justify-between">
        <input
          type="text"
          placeholder="Search Rooms.."
          value={searchTerm}
          onChange={handleSearch}
          className="px-3 py-2 w-150 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 mr-2 h-10 dark:bg-slate-800 placeholder-gray-500"
        />
        <div></div>
        <Button
          gradientDuoTone="purpleToBlue"
          outline
          onClick={handleGenerateReport}
          className=""
        >
          Generate Report
        </Button>
      </div>

      <div className="flex-wrap flex gap-4 justify-start p-3">
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">
                Total Single Rooms
              </h3>
              <p className="text-2xl">{totalSingleRooms}</p>
            </div>
            <HiOutlineHome className="bg-lime-400 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
        </div>

        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">
                Total Double Rooms
              </h3>
              <p className="text-2xl">{totalDoubleRooms}</p>
            </div>
            <HiOutlineHome className="bg-lime-600 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
        </div>

        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">
                Total Triple Rooms
              </h3>
              <p className="text-2xl">{totalTripleRooms}</p>
            </div>
            <HiOutlineHome className="bg-lime-800 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
        </div>
      </div>
      {currentUser.isAdmin && userRoom.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Added Date</Table.HeadCell>
              <Table.HeadCell>Room NO</Table.HeadCell>
              <Table.HeadCell>Room Type</Table.HeadCell>
              <Table.HeadCell>Gender</Table.HeadCell>
              <Table.HeadCell>Price(RS.)</Table.HeadCell>
              <Table.HeadCell>Furnished status</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>Edit</Table.HeadCell>
            </Table.Head>
            {userRoom.map((room) => (
              <Table.Body className="divide-y" key={room._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(room.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className="font-medium text-gray-900 dark:text-white"
                      to={`/room/${room.slug}`}
                    >
                      {`RNO ${room.roomno}`}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{room.roomtype} </Table.Cell>
                  <Table.Cell>{room.gender}</Table.Cell>
                  <Table.Cell>{room.price}</Table.Cell>
                  <Table.Cell>
                    {room.furnished ? "FURNISHED" : "UNFURNISHED"}
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                      onClick={() => {
                        setShowModel(true);
                        setRoomIdToDelete(room._id);
                      }}
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className="text-teal-500 hover:underline"
                      to={`/update-room/${room._id}`}
                    >
                      <span>Edit</span>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
        </>
      ) : (
        <p>You have no products to show</p>
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
              Are you sure you want to Delete this room
            </h3>
          </div>
          <div className="flex justify-center gap-4">
            <Button color="failure" onClick={handleDeleteRoom}>
              Yes, I am sure
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
