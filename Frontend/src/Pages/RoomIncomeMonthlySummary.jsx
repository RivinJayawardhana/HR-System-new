import { Button, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import {
  HiBookmark,
  HiBookmarkAlt,
  HiInformationCircle,
  HiOutlineBookmarkAlt,
  HiOutlineExclamationCircle,
} from "react-icons/hi";
import { useSelector } from "react-redux";
import html2pdf from "html2pdf.js";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function RoomIncomeMonthlySummary() {
  const [userBookingRequests, setUserBookingRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalBookingRequests, setTotalBookingRequests] = useState(0);
  const [totalBookingIncome, setTotalBookingIncome] = useState(0);
  const [approvedBookingsCount, setApprovedBookingsCount] = useState(0);
  const [totalBookingIncomeByMonth, setTotalBookingIncomeByMonth] = useState(
    Array(12).fill(0)
  );

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(
          `/api/bookings/getbookings?searchTerm=${searchTerm}`
        );
        const data = await res.json();
        if (res.ok) {
          setUserBookingRequests(data.bookings);
          setTotalBookingRequests(data.totalBookingRequests);

          // Calculate total income from approved bookings
          const approvedBookings = data.bookings.filter(
            (booking) => booking.bookingstatus === true
          );
          const total = approvedBookings.reduce(
            (acc, booking) => acc + booking.price,
            0
          );
          setTotalBookingIncome(total);
          setApprovedBookingsCount(approvedBookings.length);

          // Initialize array for monthly income for the last 12 months
          const monthlyIncome = Array(12).fill(0);
          const currentDate = new Date();
          const currentMonth = currentDate.getMonth(); // 0 = January, 11 = December

          data.bookings.forEach((booking) => {
            if (booking.bookingstatus) {
              const bookingDate = new Date(booking.updatedAt);
              const bookingMonth = bookingDate.getMonth(); // 0 = January, 11 = December
              const bookingYear = bookingDate.getFullYear();

              // Calculate how many months ago the booking was made
              const monthDiff =
                (currentDate.getFullYear() - bookingYear) * 12 +
                (currentDate.getMonth() - bookingMonth);

              // Only consider bookings within the last 12 months
              if (monthDiff >= 0 && monthDiff < 12) {
                // Calculate the correct index for this booking (shifted by current month)
                const index = (currentMonth - monthDiff + 12) % 12;
                monthlyIncome[index] += booking.price;
              }
            }
          });

          setTotalBookingIncomeByMonth(monthlyIncome);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchBookings();
  }, [searchTerm]);

  const chartData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Booking Income (Rs.)",
        data: totalBookingIncomeByMonth,
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) {
            return null;
          }
          // Create a gradient for the bars
          const gradient = ctx.createLinearGradient(
            0,
            chartArea.bottom,
            0,
            chartArea.top
          );
          gradient.addColorStop(0, "rgba(54, 162, 235, 0.6)"); // Starting color (light blue)
          gradient.addColorStop(1, "rgba(0, 123, 255, 0.8)"); // Ending color (darker blue)

          return gradient;
        },
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
        hoverBackgroundColor: "rgba(54, 162, 235, 0.8)",
        hoverBorderColor: "rgba(255, 99, 132, 1)", // Hover effect for borders
        borderRadius: 2, // Rounded corners for bars
        barThickness: "flex", // Makes the bar thickness flexible
        hoverBorderWidth: 3, // Thicker border on hover
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Months",
          font: {
            size: 16,
          },
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Income (Rs.)",
          font: {
            size: 16,
          },
        },
        ticks: {
          stepSize: 25000,
        },
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: "Booking Income for the Last 12 Months",
        font: {
          size: 24,
        },
      },
    },
  };

  return (
    <div className="table-auto md:mx-auto justify-center  p-24">
      <div className="flex-wrap flex gap-4 justify-start p-3">
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">
                Total Booking Requests
              </h3>
              <p className="text-2xl">{totalBookingRequests}</p>
            </div>
            <HiOutlineBookmarkAlt className="bg-blue-400 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
        </div>

        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">
                Total Approved Bookings
              </h3>
              <p className="text-2xl">{approvedBookingsCount}</p>
            </div>
            <HiBookmark className="bg-green-400 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
        </div>

        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">
                Total Approved Booking Income
              </h3>
              <p className="text-2xl">Rs. {totalBookingIncome}.00</p>
            </div>
            <HiInformationCircle className="bg-yellow-400 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
        </div>
      </div>

      <div
        className="p-4 mt-6 border rounded-md shadow-md "
        style={{ height: "400px", width: "100%" }}
      >
        {totalBookingIncomeByMonth.length > 0 && (
          <Bar data={chartData} options={chartOptions} />
        )}
      </div>
    </div>
  );
}
