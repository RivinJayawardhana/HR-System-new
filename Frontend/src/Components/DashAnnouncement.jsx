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

export default function DashAnnouncement() {
  const { currentUser } = useSelector((state) => state.user);
  const [Announcement, setAnnouncement] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModel, setShowModel] = useState(false);
  const [AnnouncementIdToDelete, setAnnouncementIdToDelete] = useState("");
  const [totalAnnouncements, setTotalAnnouncements] = useState(0);
  const [completedCount, setCompleteStatus] = useState();
  const [searchName, setSearchName] = useState("");

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const res = await fetch(`/api/announcement/get_all_announcements`);
        const data = await res.json();
        const length = data.length;
        console.log(data);

        const completedCount = data.filter(
          (Announcement) => Announcement.status === true
        ).length;

        setCompleteStatus(completedCount);

        setTotalAnnouncements(length);
        if (res.ok) {
          setAnnouncement(data);
          if (data.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log("error in fetching", error);
      }
    };

    // Only fetch Announcements if there is a valid currentUser
    if (currentUser) {
      fetchAnnouncement();
    }
    // Make sure the effect runs only when currentUser changes
  }, [currentUser]); // Removed Announcement from dependency array

  //delete Announcement by id
  const handleDeleteAnnouncement = async () => {
    setShowModel(false);
    try {
      const res = await fetch(
        `/api/announcement/delete_announcement/${AnnouncementIdToDelete}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setAnnouncement((prev) =>
          prev.filter(
            (Announcements) => Announcements._id !== AnnouncementIdToDelete
          )
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
          <p>Total Announcements: ${totalAnnouncements}</p>
          <p>Completed Announcements : ${completedCount}</p>
         
        </div>
        <br>
        <br>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Description</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            ${Announcement.map(
              (item) => `
              <tr>
                <td>${item.title}</td>
                <td>${item.category}</td>
                <td>${item.description}</td>
                <td>${item.date}</td>
              </tr>
            `
            ).join("")}
          </tbody>
        </table>
      `;

    html2pdf()
      .from(content)
      .set({ margin: 1, filename: "Announcement_report.pdf" })
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
                  Total Announcements
                </h3>
                <p className="text-2xl">{totalAnnouncements}</p>
              </div>

              <HiOutlineArchive className="bg-green-600 text-white rounded-full text-5xl p-3 shadow-lg" />
            </div>
            <div className="flex gap-2 text-sm">
              <span className="text-green-500 flex items-center">
                <HiOutlineArchive />
                {totalAnnouncements}
              </span>
              <div className="text-gray-500">Total</div>
            </div>
          </div>
        </div>
      </div>
      <h1 className="pt-6 px-4 font-semibold">Announcements </h1>
      {Array.isArray(Announcement) && Announcement.length > 0 ? (
        <>
          <div className="flex ">
            <TextInput
              type="text"
              placeholder="Search a announcments by (category)"
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
            <Link to="/announcement-form">
              <Button gradientDuoTone="purpleToBlue" outline className="mb-1">
                Post Announcement
              </Button>
            </Link>
          </div>

          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Description</Table.HeadCell>
              <Table.HeadCell>Date</Table.HeadCell>
              <Table.HeadCell>Action</Table.HeadCell>
            </Table.Head>

            {Announcement.filter((item) => {
              const searchQuery = searchName.toLowerCase();

              // Ensure name and email are defined before calling toLowerCase()
              const title = item.title
                ? item.title.toLowerCase().includes(searchQuery)
                : false;
              const category = item.category
                ? item.category.toLowerCase().includes(searchQuery)
                : false;

              // Return true if any of the search criteria match
              return title || category;
            }).map((item) => (
              <Table.Body className="divide-y" key={item._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>{item.title}</Table.Cell>
                  <Table.Cell>{item.category}</Table.Cell>
                  <Table.Cell>{item.description}</Table.Cell>
                  <Table.Cell>
                    {new Date(item.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}{" / "}
                    {new Date(item.createdAt).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </Table.Cell>

                  <Table.Cell>
                    <div className="flex flex-row gap-2">
                      <Link to={`/update-announcement/${item._id}`}>
                        <button>
                          <box-icon name="edit-alt" color="green"></box-icon>
                        </button>
                      </Link>

                      <button
                        onClick={() => {
                          setShowModel(true);
                          setAnnouncementIdToDelete(item._id);
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
        <p>You have not any Announcement yet</p>
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
            <Button color="failure" onClick={handleDeleteAnnouncement}>
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
