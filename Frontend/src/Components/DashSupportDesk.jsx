import { Button, Modal, Table, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import {
  HiOutlineArchive,
  HiOutlineExclamationCircle,
  HiOutlineSupport,
} from "react-icons/hi";
import { useSelector } from "react-redux";

import { Link } from "react-router-dom";
import html2pdf from "html2pdf.js";

export default function DashSupportDesk() {
  const { currentUser } = useSelector((state) => state.user);
  const [Ticket, setTicket] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModel, setShowModel] = useState(false);
  const [TicketIdToDelete, setTicketIdToDelete] = useState("");
  const [totalTickets, setTotalTickets] = useState(0);
  const [completedCount, setCompleteStatus] = useState();
  const [searchName, setSearchName] = useState("");


  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await fetch(`/api/ticket/get_all_tickets`);
        const data = await res.json();
        const length = data.length;
        console.log(data);

        const completedCount = data.filter(
          (Ticket) => Ticket.status === true
        ).length;
        console.log("Completed Tickets:", completedCount);
        setCompleteStatus(completedCount);

        setTotalTickets(length);
        if (res.ok) {
          setTicket(data);
          if (data.length < 9) {
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
  }, [currentUser]); // Removed Ticket from dependency array

  //delete Ticket by id
  const handleDeleteTicket = async () => {
    setShowModel(false);
    try {
      const res = await fetch(`/api/ticket/delete_ticket/${TicketIdToDelete}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setTicket((prev) =>
          prev.filter((Tickets) => Tickets._id !== TicketIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const generatePDFReport = () => {
    const content = `
        <style>
          table {
            margin:0 auto;
            width: 90%;
            border-collapse: collapse;
          }
          th, td {
            padding: 8px;
            text-align: left;
            border-bottom: 1px solid #ddd;
          }
          th {
            background-color: #f2f2f2;
            font-size: 10px; 
          }
          td {
            font-size: 10px; 
          }
          .report-title{
            text-align:center;
            font-size:18px;
          }
          .details{
            margin-top:50px;
            margin-left:30px;

          }
        </style>

        <h1 class="report-title"><b>Order Details Report</b></h1>
        <div class="details">
          <p>Total Tickets: ${totalTickets}</p>
          <p>Completed Tickets : ${completedCount}</p>
         
        </div>
        <br>
        <br>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Issue Type</th>
              <th>Title</th>
              <th>Description</th>
              <th>Reply</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${Ticket.map(
              (item) => `
              <tr>
                <td>${item.studentName}</td>
                <td>${item.email}</td>
                <td>${item.issueType}</td>
                <td>${item.title}</td>
                <td>${item.description}</td>
                <td>${item.reply}</td>
                <td>${item.status}</td>
              </tr>
            `
            ).join("")}
          </tbody>
        </table>
      `;

    html2pdf()
      .from(content)
      .set({ margin: 1, filename: "Ticket_report.pdf" })
      .save();
  };

  const handleGenerateReport = () => {
    generatePDFReport();
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      <div className="flex flex-wrap gap-5">
        <div className="">
          <Button
            gradientDuoTone="purpleToBlue"
            outline
            onClick={handleGenerateReport}
            className=""
          >
            Generate Report
          </Button>
        </div>

        <div className="flex-wrap flex gap-4 justify-center">
          <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
            <div className="flex justify-between">
              <div className="">
                <h3 className="text-gray-500 text-md uppercase">
                  Total Ticket
                </h3>
                <p className="text-2xl">{totalTickets}</p>
              </div>

              <HiOutlineArchive className="bg-green-600 text-white rounded-full text-5xl p-3 shadow-lg" />
            </div>
            <div className="flex gap-2 text-sm">
              <span className="text-green-500 flex items-center">
                <HiOutlineArchive />
                {totalTickets}
              </span>
              <div className="text-gray-500">Total</div>
            </div>
          </div>
          <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
            <div className="flex justify-between">
              <div className="">
                <h3 className="text-gray-500 text-md uppercase">
                  Total Completed
                </h3>
                <p className="text-2xl">{completedCount}</p>
              </div>

              <HiOutlineSupport className="bg-green-600 text-white rounded-full text-5xl p-3 shadow-lg" />
            </div>
            <div className="flex gap-2 text-sm">
              <span className="text-green-500 flex items-center">
                <HiOutlineSupport />
                {completedCount}
              </span>
              <div className="text-gray-500">Currently</div>
            </div>
          </div>
        </div>
      </div>
      <h1 className="pt-6 px-4 font-semibold">Tickets recieved</h1>
      {Array.isArray(Ticket) && Ticket.length > 0 ? (
        <>
          <div className="flex ">
            <TextInput
              type="text"
              placeholder="Search a tickets by (First Name or Email)"
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
          <div className="flex gap-5">
            

          </div>

          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Student id</Table.HeadCell>
              <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Issue type</Table.HeadCell>
              <Table.HeadCell>title</Table.HeadCell>
              <Table.HeadCell>Description</Table.HeadCell>
              <Table.HeadCell>Reply</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
              <Table.HeadCell>Actions</Table.HeadCell>
            </Table.Head>

            {Ticket.filter((item) => {
               const searchQuery = searchName.toLowerCase();

               // Ensure name and email are defined before calling toLowerCase()
               const name = item.studentName ? item.studentName.toLowerCase().includes(searchQuery) : false;
               const email = item.email ? item.email.toLowerCase().includes(searchQuery) : false;
             
               // Return true if any of the search criteria match
               return name || email;

              
            }).map((item) => (
              <Table.Body className="divide-y" key={item._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>{item.studentId}</Table.Cell>
                  <Table.Cell>{item.studentName}</Table.Cell>
                  <Table.Cell>{item.email}</Table.Cell>
                  <Table.Cell>{item.issueType}</Table.Cell>
                  <Table.Cell>{item.title}</Table.Cell>
                  <Table.Cell>{item.description}</Table.Cell>
                  <Table.Cell>{item.reply}</Table.Cell>
                  <Table.Cell>
                    <span
                      className={
                        item.status ? "text-green-600" : "text-red-600"
                      }
                    >
                      {item.status ? "Completed" : "Not Completed"}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex flex-row gap-2">
                      <Link to={`/update-ticket/${item._id}`}>
                        <button>
                          <box-icon name="edit-alt" color="green"></box-icon>
                        </button>
                      </Link>
                      

                      <button
                        onClick={() => {
                          setShowModel(true);
                          setTicketIdToDelete(item._id);
                        }}
                      >
                        <box-icon
                          type="solid"
                          name="message-square-x"
                          color="red"
                        ></box-icon>
                      </button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>

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
        <p>You have not any Ticket yet</p>
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
              Are you sure you want to Delete this Record
            </h3>
          </div>
          <div className="flex justify-center gap-4">
            <Button color="failure" onClick={handleDeleteTicket}>
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
