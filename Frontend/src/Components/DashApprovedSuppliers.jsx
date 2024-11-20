import { Button, Modal, Table, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import {
  HiOutlineArchive,
  HiOutlineExclamationCircle,
  HiOutlineMail,
} from "react-icons/hi";
import { Link } from "react-router-dom";
import html2pdf from "html2pdf.js";

export default function ApprovedSuppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModel, setShowModel] = useState(false);
  const [supplierIdToDelete, setSupplierIdToDelete] = useState("");
  const [totalSuppliers, setTotalSuppliers] = useState(0);
  const [searchName, setSearchName] = useState("");
  const [showEmailModal, setShowEmailModal] = useState(false); // For controlling modal visibility
  const [emailMessage, setEmailMessage] = useState(""); // To store the typed message
  const [selectedSupplierEmail, setSelectedSupplierEmail] = useState(""); // Store selected supplier email
  const [selectedSupplierName, setSelectedSupplierName] = useState(""); // Store selected supplier name

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await fetch(`/api/supplier/get_all_suppliers`);
        const data = await res.json();
        const approvedSuppliers = data.filter(
          (supplier) => supplier.isSupplier === true
        );
        setTotalSuppliers(approvedSuppliers.length);

        if (res.ok) {
          setSuppliers(approvedSuppliers);
          if (approvedSuppliers.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log("Error fetching suppliers", error);
      }
    };

    fetchSuppliers();
  }, []);

  // delete supplier by id
  const handleDeleteSupplier = async () => {
    setShowModel(false);
    try {
      const res = await fetch(
        `/api/supplier/delete_supplier/${supplierIdToDelete}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setSuppliers((prev) =>
          prev.filter((supplier) => supplier._id !== supplierIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  //Generate report
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
          font-size: 14px;
        }
        th {
          background-color: #f2f2f2;
          font-size: 12px;
        }
      </style>
      <h1><b> Approved Supplier Details Report </b></h1>
      <table>
        <thead>
          <tr>
            <th>Joined At</th>
            <th>Supplier Name</th>
            <th>Email</th>
            <th>Contact No</th>
            <th>Business Address</th>
            <th>Product Categories</th>
          </tr>
        </thead>
        <tbody>
          ${suppliers
            .map(
              (item) => `
            <tr>
              <td>${new Date(item.createdAt).toLocaleDateString()}</td>
              <td>${item.supplierName}</td>
              <td>${item.email}</td>
              <td>${item.contactNumber}</td>
              <td>${item.businessAddress}</td>
              <td>${item.productCategories.join(" , ")}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;

    html2pdf()
      .from(content)
      .set({ margin: 1, filename: "Booking_Request_report.pdf" })
      .save();
  };

  const sendEmail = async () => {
    try {
      const res = await fetch("/api/supplier/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: selectedSupplierEmail,
          supplierName: selectedSupplierName,
          message: emailMessage,
        }),
      });

      if (res.ok) {
        console.log("Email sent successfully");
        setShowEmailModal(false); // Close modal after sending email
      } else {
        console.error("Failed to send email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  // Open email modal and set selected supplier email and name
  const handleOpenEmailModal = (email, name) => {
    setSelectedSupplierEmail(email);
    setSelectedSupplierName(name);
    setShowEmailModal(true); // Show modal
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      <div className="flex flex-wrap gap-5">
        <div className="">
          <Button
            gradientDuoTone="purpleToBlue"
            outline
            onClick={generatePDFReport}
          >
            Generate Report
          </Button>
        </div>

        <div className="flex-wrap flex gap-4 justify-center">
          <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
            <div className="flex justify-between">
              <div className="">
                <h3 className="text-gray-500 text-md uppercase">
                  Total Approved Suppliers
                </h3>
                <p className="text-2xl">{totalSuppliers}</p>
              </div>

              <HiOutlineArchive className="bg-green-600 text-white rounded-full text-5xl p-3 shadow-lg" />
            </div>
            <div className="flex gap-2 text-sm">
              <span className="text-green-500 flex items-center">
                <HiOutlineArchive />
                {totalSuppliers}
              </span>
              <div className="text-gray-500">Total</div>
            </div>
          </div>
        </div>
      </div>
      <h1 className="pt-6 px-4 font-semibold">Approved Suppliers</h1>
      {Array.isArray(suppliers) && suppliers.length > 0 ? (
        <>
          <div className="flex ">
            <TextInput
              type="text"
              placeholder="Search a supplier by (Name or Email)"
              required
              id="search"
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
          <Link to="/dashboard?tab=pending_suppliers">
            <Button gradientDuoTone="purpleToBlue" outline className="">
              Become Seller Requests
            </Button>
          </Link>{" "}
          <br />
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Joined Date</Table.HeadCell>
              <Table.HeadCell>Supplier Name</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Contact Number</Table.HeadCell>
              <Table.HeadCell>Business Address</Table.HeadCell>
              <Table.HeadCell>Product Categories</Table.HeadCell>
              <Table.HeadCell>Actions</Table.HeadCell>
            </Table.Head>

            {suppliers
              .filter((item) => {
                const searchQuery = searchName.toLowerCase();
                const nameMatch = item.supplierName
                  ? item.supplierName.toLowerCase().includes(searchQuery)
                  : false;
                const emailMatch = item.email
                  ? item.email.toLowerCase().includes(searchQuery)
                  : false;

                // Return true if either name or email matches
                return nameMatch || emailMatch;
              })
              .map((item) => (
                <Table.Body className="divide-y" key={item._id}>
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>{item.supplierName}</Table.Cell>
                    <Table.Cell>{item.email}</Table.Cell>
                    <Table.Cell>{item.contactNumber}</Table.Cell>
                    <Table.Cell>{item.businessAddress}</Table.Cell>
                    <Table.Cell>{item.productCategories.join(", ")}</Table.Cell>
                    <Table.Cell>
                      <div className="flex flex-row gap-2">
                        <Link>
                          <button
                            className="bg-blue-600 rounded-lg p-2"
                            onClick={() =>
                              handleOpenEmailModal(
                                item.email,
                                item.supplierName
                              )
                            }
                          >
                            <HiOutlineMail color="white" />
                          </button>
                        </Link>

                        <button
                          onClick={() => {
                            setShowModel(true);
                            setSupplierIdToDelete(item._id);
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
            <button className="w-full text-teal-500 self-center text-sm py-7">
              Show more
            </button>
          )}
        </>
      ) : (
        <p>No approved suppliers found</p>
      )}

      <Modal
        show={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        className=" shadow-xl"
      >
        <Modal.Header className="bg-blue-400 text-white rounded-t-lg">
          <h2 className="text-xl font-semibold">
            Send Email to {selectedSupplierName}
          </h2>
        </Modal.Header>
        <Modal.Body className="bg-gray-50">
          <div className="space-y-4">
            <label
              htmlFor="message"
              className="text-sm font-medium text-gray-600"
            >
              Your Message
            </label>
            <textarea
              id="message"
              className="w-full h-40 p-3 text-sm border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Type your Item list here..."
              value={emailMessage}
              onChange={(e) => setEmailMessage(e.target.value)}
              required
            />
          </div>
        </Modal.Body>
        <Modal.Footer className="bg-gray-50">
          <div className="flex justify-end space-x-4">
            <Button
              color="blue"
              onClick={sendEmail}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-5 py-2"
            >
              Send Email
            </Button>
            <Button
              color="gray"
              onClick={() => setShowEmailModal(false)}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg px-5 py-2"
            >
              Cancel
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

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
              Are you sure you want to delete this supplier?
            </h3>
          </div>
          <div className="flex justify-center gap-4">
            <Button color="failure" onClick={handleDeleteSupplier}>
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
