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

export default function DashMyRequests() {
  const { currentUser } = useSelector((state) => state.user);
  const [Request, setRequest] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModel, setShowModel] = useState(false);
  const [requestIdToDelete, setrequestIdToDelete] = useState("");
  const [totalRequests, setTotalRequests] = useState(0);
  const [completedCount, setCompleteStatus] = useState();
  const [searchName, setSearchName] = useState("");


  //get total sales
    // const calculateTotalRequest = () => {
    //   const total = Request.reduce((accumulator, currentOrder) => {
    //     return accumulator + parseFloat(currentOrder.totalcost);
    //   }, 0);
    //   setTotalRequests(total);
    // };

  //fetch all the Request from database
  //fetch all the Request from database
useEffect(() => {
  const fetchRequest = async () => {
    try {
      const res = await fetch(`/api/request/get_all_req`);
      const data = await res.json();
      
      if (res.ok) {
        // Filter requests to only show the current user's requests
        const userRequests = data.filter((request) => request.email === currentUser.email);

        const length = userRequests.length;

        const completedCount = userRequests.filter(request => request.status === true).length;
        console.log("Completed Requests:", completedCount);
        setCompleteStatus(completedCount);

        setTotalRequests(length);
        setRequest(userRequests);
        if (userRequests.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log("error in fetching", error);
    }
  };

  // Only fetch requests if there is a valid currentUser
  if (currentUser) {
    fetchRequest();
  }
}, [currentUser]); // Removed Request from dependency array


  //delete request by id
  const handleDeleteRequest = async () => {
    setShowModel(false);
    try {
      const res = await fetch(`/api/request/delete_req/${requestIdToDelete}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setRequest((prev) =>
          prev.filter((requests) => requests._id !== requestIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

//   const generatePDFReport = () => {
//     const content = `
//         <style>
//           table {
//             margin:0 auto;
//             width: 90%;
//             border-collapse: collapse;
//           }
//           th, td {
//             padding: 8px;
//             text-align: left;
//             border-bottom: 1px solid #ddd;
//           }
//           th {
//             background-color: #f2f2f2;
//             font-size: 10px; 
//           }
//           td {
//             font-size: 10px; 
//           }
//           .report-title{
//             text-align:center;
//             font-size:18px;
//           }
//           .details{
//             margin-top:50px;
//             margin-left:30px;

//           }
//         </style>

//         <h1 class="report-title"><b>Order Details Report</b></h1>
//         <div class="details">
//           <p>Total Requests: ${totalRequests}</p>
//           <p>Completed Requests : ${completedCount}</p>
         
//         </div>
//         <br>
//         <br>
//         <table>
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Email</th>
//               <th>Room Number</th>
//               <th>Date</th>
//               <th>Additional Info</th>
//               <th>Comments</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${Request.map(
//               (item) => `
//               <tr>
//                 <td>${item.name}</td>
//                 <td>${item.email}</td>
//                 <td>${item.roomNumber}</td>
//                 <td>${item.date}</td>
//                 <td>${item.additionalDetails}</td>
//                 <td>${item.commentsUser}.00</td>
//                 <td>${item.status}</td>
//               </tr>
//             `
//             ).join("")}
//           </tbody>
//         </table>
//       `;

//     html2pdf()
//       .from(content)
//       .set({ margin: 1, filename: "Request_report.pdf" })
//       .save();
//   };

//   const handleGenerateReport = () => {
//     generatePDFReport();
//   };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      <div className="flex flex-wrap gap-5">
        {/* <div className="">
          <Button
            gradientDuoTone="purpleToBlue"
            outline
            onClick={handleGenerateReport}
            className=""
          >
            Generate Report
          </Button>
        </div> */}

        {/* <div className="flex-wrap flex gap-4 justify-center">
          <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
            <div className="flex justify-between">
              <div className="">
                <h3 className="text-gray-500 text-md uppercase">
                  Total Request
                </h3>
                <p className="text-2xl">{totalRequests}</p>
              </div>

              <HiOutlineArchive className="bg-green-600 text-white rounded-full text-5xl p-3 shadow-lg" />
            </div>
            <div className="flex gap-2 text-sm">
              <span className="text-green-500 flex items-center">
                <HiOutlineArchive />
                {totalRequests}
              </span>
              <div className="text-gray-500">Total</div>
            </div>
          </div>
          <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
            <div className="flex justify-between">
              <div className="">
                <h3 className="text-gray-500 text-md uppercase">Total Completed</h3>
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

        </div> */}
      </div>
      <h1 className="pt-6 px-4 font-semibold">My Requests</h1>
      <Link to='/dashboard/cleaning_request'>
          <button className="bg-indigo-600 hover:bg-indigo-700  rounded-lg px-3 p-2 mt-2 text-white">Request Clean Service</button>
          </Link>
      {Array.isArray(Request) && Request.length > 0 ? (
        <>
          
          <div className="flex ">
            
            <TextInput
              type="text"
              placeholder="Search a request by (First Name or Email or Room Number)"
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

          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Room Number</Table.HeadCell>
              <Table.HeadCell>Date</Table.HeadCell>
              <Table.HeadCell>Additional Info</Table.HeadCell>
              <Table.HeadCell>Feedback from management</Table.HeadCell>
              <Table.HeadCell>My comments</Table.HeadCell>

              <Table.HeadCell>Status</Table.HeadCell>
              <Table.HeadCell>Actions</Table.HeadCell>
            </Table.Head>

            {Request.filter((item) => {
              const searchQuery = searchName.toLowerCase();
              const name = item.name.toLowerCase().includes(searchQuery);
              const email = item.email.toLowerCase().includes(searchQuery);

              // Return true if any of the search criteria match
              return name || email;
            }).map((item) => (
              <Table.Body className="divide-y" key={item._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>{item.name}</Table.Cell>
                  <Table.Cell>{item.email}</Table.Cell>
                  <Table.Cell>{item.roomNumber}</Table.Cell>
                  <Table.Cell>{item.date}</Table.Cell>
                  <Table.Cell>{item.additionalDetails}</Table.Cell>
                  <Table.Cell>{item.commentsAdmin}</Table.Cell>
                  <Table.Cell>{item.commentsUser}</Table.Cell>

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
                      
                      <Link to={`/update-comment-user/${item._id}`}>
                        <button>
                        <box-icon name='comment-detail' type='solid' color='blue'></box-icon>
                        </button>
                      </Link>

                      
                      
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
        <p>You have not any Request yet</p>
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
            <Button color="failure" onClick={handleDeleteRequest}>
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
