import { Button, Modal, Table, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import {

  HiArchive,
  HiOutlineArchive,
  HiOutlineExclamationCircle,
  HiOutlineSupport,
} from "react-icons/hi";
import { useSelector } from "react-redux";

import { Link } from "react-router-dom";
import html2pdf from "html2pdf.js";

export default function DashRecievedOrders() {
  const { currentUser } = useSelector((state) => state.user);
  const [Order, setOrder] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModel, setShowModel] = useState(false);
  const [OrderIdToDelete, setOrderIdToDelete] = useState("");
  const [totalOrders, setTotalOrders] = useState(0);
  const [completedCount, setCompleteStatus] = useState();
  const [searchName, setSearchName] = useState("");
  const [totalOrderIncome, setTotalOrderIncome] = useState("");

  //get total sales
    // const calculateTotalOrder = () => {
    //   const total = Order.reduce((accumulator, currentOrder) => {
    //     return accumulator + parseFloat(currentOrder.totalcost);
    //   }, 0);
    //   setTotalOrders(total);
    // };

  //fetch all the Order from database
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/order/getorders`);
        const data = await res.json();
        const length = data.length;
        console.log(data);

        const completedCount = data.filter(Order => Order.status === true).length;
        console.log("Completed Orders:", completedCount);
        setCompleteStatus(completedCount);

        setTotalOrders(length);
        if (res.ok) {
          setOrder(data);
          if (data.length < 9) {
            setShowMore(false);
          }
           // Calculate the total income from approved bookings
          const completedOrders = data.filter(
            (order) => order.status === true
          );
          const totalOrderIncome = completedOrders.reduce(
            (acc, order) => acc + order.totalcost,
            0
          );
          setTotalOrderIncome(totalOrderIncome,completedOrders); 
        }
      } catch (error) {
        console.log("error in fetching", error);
      }
    };

    // Only fetch Orders if there is a valid currentUser
    if (currentUser) {
      fetchOrder();
    }
    // Make sure the effect runs only when currentUser changes
  }, [currentUser]); // Removed Order from dependency array

  //delete Order by id
  const handleDeleteOrder = async () => {
    setShowModel(false);
    try {
      const res = await fetch(`/api/order/deleteorder/${OrderIdToDelete}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setOrder((prev) =>
          prev.filter((Orders) => Orders._id !== OrderIdToDelete)
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
          <p>Total Orders: ${totalOrders}</p>
          <p>Completed Orders : ${completedCount}</p>
         
        </div>
        <br>
        <br>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Contact</th>
              <th>Total Cost</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${Order.map(
              (item) => `
              <tr>
                <td>${item.productsId.map(product => (<p key={product._id} className="font-semibold">{product.title}</p>))}</td>
                <td>${item.first_name} ${item.last_name} </td>
                <td>${item.email}</td>
                <td>${item.address} ${item.state}</td>
                <td>${item.phone}</td>
                <td>${item.totalcost}.00</td>
                <td>${item.status}</td>
              </tr>
            `
            ).join("")}
          </tbody>
        </table>
      `;

    html2pdf()
      .from(content)
      .set({ margin: 1, filename: "Order_report.pdf" })
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
                  Total Orders
                </h3>
                <p className="text-2xl">{totalOrders}</p>
              </div>

              <HiOutlineArchive className="bg-green-600 text-white rounded-full text-5xl p-3 shadow-lg" />
            </div>
            <div className="flex gap-2 text-sm">
              <span className="text-green-500 flex items-center">
                <HiOutlineArchive />
                {totalOrders}
              </span>
              <div className="text-gray-500">Total</div>
            </div>
          </div>
          <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
            <div className="flex justify-between">
              <div className="">
                <h3 className="text-gray-500 text-md uppercase">Total Delivered</h3>
                <p className="text-2xl">{completedCount}</p>
              </div>

              <HiArchive className="bg-green-600 text-white rounded-full text-5xl p-3 shadow-lg" />
            </div>
            <div className="flex gap-2 text-sm">
              <span className="text-green-500 flex items-center">
                <HiArchive />
                {completedCount}
              </span>
              <div className="text-gray-500">Currently</div>
            </div>
          </div>

          <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
            <div className="flex justify-between">
              <div className="">
                <h3 className="text-gray-500 text-md uppercase">Total Order Income</h3>
                <p className="text-2xl">Rs.{totalOrderIncome}.00</p>
              </div>

              <HiOutlineExclamationCircle className="bg-green-600 text-white rounded-full text-5xl p-3 shadow-lg" />
            </div>
           
          </div>

        </div>
        <div className="flex justify-end pb-4">
          <Link to="/ordermonthlysummary">
            <Button
              type="button"
              gradientDuoTone="purpleToBlue"
              className="w-full , text-black bg-slate-400 "
              outline
            >
              Order Income Summary
            </Button>
          </Link>
        </div>

      </div>
      <h1 className="pt-6 px-4 font-semibold">Order recieved</h1>
      {Array.isArray(Order) && Order.length > 0 ? (
        <>
          <div className="flex ">
            <TextInput
              type="text"
              placeholder="Search a Order by (First Name or Email or Room Number)"
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
              <Table.HeadCell>Item</Table.HeadCell>
              <Table.HeadCell>Date</Table.HeadCell>
              <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>address</Table.HeadCell>
              <Table.HeadCell>contact </Table.HeadCell>
              <Table.HeadCell>total cost</Table.HeadCell>
              <Table.HeadCell>status</Table.HeadCell>
              <Table.HeadCell>Actions</Table.HeadCell>
            </Table.Head>

            {Order.filter((item) => {
              const searchQuery = searchName.toLowerCase();

              // Safely check if name and email exist before calling toLowerCase()
              const name = item.first_name ? item.first_name.toLowerCase().includes(searchQuery) : false;
              const email = item.email ? item.email.toLowerCase().includes(searchQuery) : false;

              // Return true if any of the search criteria match
              return name || email;
            }).map((item) => (
              <Table.Body className="divide-y" key={item._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>{item.productsId.map(product => (
                    <p key={product._id} className="font-semibold">{product.title}</p>
                  ))}</Table.Cell>
                  <Table.Cell>{new Date(item.createdAt).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                    })}</Table.Cell>
                  <Table.Cell>{item.first_name} {item.last_name}</Table.Cell>
                  <Table.Cell>{item.email}</Table.Cell>
                  <Table.Cell>{item.address} {item.state}</Table.Cell>
                  <Table.Cell>{item.phone}</Table.Cell>
                  <Table.Cell>Rs.{item.totalcost}.00</Table.Cell>
                  <Table.Cell>
                  {item.status ? (
                      <span className="text-green-500 font-semibold">Completed</span>
                    ) : (
                      <span className="text-red-500 font-semibold">Pending</span>
                    )}
                  </Table.Cell>
                  
                  <Table.Cell>
                    <div className="flex flex-row gap-2">
                      <Link to={`/update-order/${item._id}`}>
                        <button>
                          <box-icon name="edit-alt" color="green"></box-icon>
                        </button>
                      </Link>
                     

                      <button
                        onClick={() => {
                          setShowModel(true);
                          setOrderIdToDelete(item._id);
                        }}
                      >
                       <box-icon type='solid' name='message-square-x' color='red'></box-icon>
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
        <p>You have not any Order yet</p>
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
            <Button color="failure" onClick={handleDeleteOrder}>
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
