import { Button, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import {
  HiArchive,
  HiBookmark,
  HiBookmarkAlt,
  HiInformationCircle,
  HiOutlineArchive,
  HiOutlineBookmarkAlt,
  HiOutlineExclamationCircle,
} from "react-icons/hi";
import { useSelector } from "react-redux";
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

export default function OrderIncomeMonthlySummary() {
  const { currentUser } = useSelector((state) => state.user);
  const [Order, setOrder] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [completedCount, setCompleteStatus] = useState();
  const [totalOrderIncome, setTotalOrderIncome] = useState("");
  const [ordersByMonth, setOrdersByMonth] = useState(Array(12).fill(0));
  const [incomeByMonth, setIncomeByMonth] = useState(Array(12).fill(0)); // new state for income

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/order/getorders`);
        const data = await res.json();
        const length = data.length;

        if (res.ok) {
          setOrder(data);

          // Calculate orders by month and income by month
          const monthlyOrders = Array(12).fill(0);
          const monthlyIncome = Array(12).fill(0);
          const currentDate = new Date();
          const currentMonth = currentDate.getMonth();

          const completedCount = data.filter(
            (Order) => Order.status === true
          ).length;
          setCompleteStatus(completedCount);
          setTotalOrders(length);

          data.forEach((order) => {
            const orderDate = new Date(order.createdAt);
            const orderMonth = orderDate.getMonth();
            const orderYear = orderDate.getFullYear();

            const completedOrders = data.filter(
              (order) => order.status === true
            );

            const totalOrderIncome = completedOrders.reduce(
              (acc, order) => acc + order.totalcost,
              0
            );
            setTotalOrderIncome(totalOrderIncome);

            const monthDiff =
              (currentDate.getFullYear() - orderYear) * 12 +
              (currentDate.getMonth() - orderMonth);

            if (monthDiff >= 0 && monthDiff < 12) {
              const index = (currentMonth - monthDiff + 12) % 12;
              monthlyOrders[index] += 1; // Increment count for this month
              monthlyIncome[index] += order.totalcost; // Add to income for this month
            }
          });

          setOrdersByMonth(monthlyOrders);
          setIncomeByMonth(monthlyIncome); // update income by month
        }
      } catch (error) {
        console.log("error in fetching", error);
      }
    };

    if (currentUser) {
      fetchOrder();
    }
  }, [currentUser]);

  // Orders per month chart data
  const chartDataOrders = {
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
        label: "Orders per Month",
        data: ordersByMonth,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
        hoverBackgroundColor: "rgba(54, 162, 235, 0.8)",
        hoverBorderColor: "rgba(255, 99, 132, 1)",
        borderRadius: 2,
        barThickness: "flex",
        hoverBorderWidth: 3,
      },
    ],
  };

  // Monthly order income chart data
  const chartDataIncome = {
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
        label: "Income per Month (Rs.)",
        data: incomeByMonth,
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 2,
        hoverBackgroundColor: "rgba(255, 159, 64, 0.8)",
        hoverBorderColor: "rgba(255, 99, 132, 1)",
        borderRadius: 2,
        barThickness: "flex",
        hoverBorderWidth: 3,
      },
    ],
  };

  // Chart options for orders chart
  const chartOptionsOrders = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Months",
          font: { size: 16 },
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Count", 
          font: { size: 16 },
        },
        ticks: {
          stepSize: 10,
        },
      },
    },
    plugins: {
      legend: { display: true },
      title: {
        display: true,
        text: "Total Orders for the Last 12 Months",
        font: { size: 24 },
      },
    },
  };

  // Chart options for income chart
  const chartOptionsIncome = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Months",
          font: { size: 16 },
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Income(Rs.)", 
          font: { size: 16 },
        },
        ticks: {
          stepSize: 25000, // Adjust based on income values
        },
      },
    },
    plugins: {
      legend: { display: true },
      title: {
        display: true,
        text: "Total Income for the Last 12 Months",
        font: { size: 24 },
      },
    },
  };

  return (
    <div className="table-auto md:mx-auto justify-center p-24">
      <div className="flex-wrap flex gap-4 justify-center">
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">Total Orders</h3>
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
              <h3 className="text-gray-500 text-md uppercase">
                Total Delivered
              </h3>
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
              <h3 className="text-gray-500 text-md uppercase">
                Total Order Income
              </h3>
              <p className="text-2xl">Rs.{totalOrderIncome}.00</p>
            </div>

            <HiOutlineExclamationCircle className="bg-green-600 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
        </div>
      </div>

      <div className="flex table-auto md:mx-auto justify-center gap-4 p-24">
        <div className="w-full h-96 border shadow-md p-5">
          <Bar data={chartDataOrders} options={chartOptionsOrders} />
        </div>
        <div className="w-full h-96  border shadow-md p-5">
          <Bar data={chartDataIncome} options={chartOptionsIncome} />
        </div>
      </div>
    </div>
  );
}
