import { Table, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiOutlineArchive, HiOutlineSupport } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function DashMyTickets() {
  const { currentUser } = useSelector((state) => state.user);
  const [Ticket, setTicket] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [totalTickets, setTotalTickets] = useState(0);
  const [completedCount, setCompleteStatus] = useState();
  const [searchName, setSearchName] = useState("");

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        console.log(currentUser._id);
        const res = await fetch(`/api/ticket/get_a_ticket_user/${currentUser._id}`);
        const data = await res.json();
        
        // Check if the response is an object (single ticket) or array
        const ticketsArray = Array.isArray(data) ? data : [data];

        const length = ticketsArray.length;
        console.log(ticketsArray);

        const completedCount = ticketsArray.filter(
          (Ticket) => Ticket.status === true
        ).length;
        console.log("Completed Tickets:", completedCount);
        setCompleteStatus(completedCount);

        setTotalTickets(length);
        if (res.ok) {
          setTicket(ticketsArray);
          if (ticketsArray.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log("error in fetching", error);
      }
    };

    // Only fetch Tickets if there is a valid currentUser
    if (currentUser) {
      fetchTicket();
    }
    // Make sure the effect runs only when currentUser changes
  }, [currentUser]);

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      <div className="flex flex-wrap gap-5"></div>
      <h1 className="pt-6 px-4 font-semibold">Tickets Sumbmitted</h1>
      {Ticket.length > 0 ? (
        <>
          <div className="flex ">
            <TextInput
              type="text"
              placeholder="Search tickets by (First Name or Email)"
              required
              id="title"
              className="flex-1"
              style={{
                width: 700,
                marginTop: 30,
                marginBottom: 30,
                marginLeft: 250,
              }}
              onChange={(e) => setSearchName(e.target.value)}
            />
          </div>
          <div className="flex gap-5"></div>

          <div className="flex flex-col gap-4">
  {Ticket.filter((item) => {
    const searchQuery = searchName.toLowerCase();

    // Ensure name and email are defined before calling toLowerCase()
    const name = item.studentName
      ? item.studentName.toLowerCase().includes(searchQuery)
      : false;
    const email = item.email
      ? item.email.toLowerCase().includes(searchQuery)
      : false;

    // Return true if any of the search criteria match
    return name || email;
  }).map((item) => (
    <div
      key={item._id}
      className="bg-white shadow-md rounded-lg p-4 dark:bg-gray-800 dark:text-white"
    >
      <div className="flex justify-between mb-2">
        <h3 className="text-xl font-semibold mx-10">{item.title}</h3>
        <span
          className={`px-2 py-1 text-sm rounded-lg ${
            item.status ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
          }`}
        >
          {item.status ? "Completed" : "Not Completed"}
        </span>
      </div>

      <div className="flex flex-col md:flex-row justify-center gap-96 font-sans">
        <div>
          <p><strong>Student ID:</strong> {item.studentId}</p>
          <p><strong>Name:</strong> {item.studentName}</p>
          <p><strong>Email:</strong> {item.email}</p>
          <p><strong>Issue Type:</strong> {item.issueType}</p>
          <p><strong>Description:</strong> {item.description}</p>
        </div>
        <div>
          <p><strong>Reply:</strong> {item.reply}</p>
        </div>
      </div>

     
    </div>
  ))}
</div>


          {showMore && (
            <button
              onClick=""
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p>You have not submitted any Ticket yet</p>
      )}
    </div>
  );
}
