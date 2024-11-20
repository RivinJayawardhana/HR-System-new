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
import annotationPlugin from "chartjs-plugin-annotation"; // Import annotation plugin
import { useEffect, useState } from "react";
import ChartDataLabels from "chartjs-plugin-datalabels"; // Import data labels plugin
import { Link } from "react-router-dom";
import { Button } from "flowbite-react";

// Register chart components, annotation plugin, and data labels plugin
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin,
  ChartDataLabels // Register the data labels plugin
);

export default function InventorySummary() {
  const [userProduct, setUserProduct] = useState([]); // Products state

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products/getproducts");
        const data = await res.json();
        if (res.ok) {
          setUserProduct(data.products); // Set products data from API
        }
      } catch (error) {
        console.error("Failed to fetch products:", error); // Log error if fetching fails
      }
    };
    fetchProducts();
  }, []);

  // Define threshold for low stock
  const lowStockThreshold = 5;

  // Group products by category
  const groupedProducts = userProduct.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {});

  // Prepare datasets for each product under each category
  const datasets = [];
  const categories = Object.keys(groupedProducts); // Categories like "Foods", "Fans", etc.

  categories.forEach((category) => {
    const products = groupedProducts[category];
    products.forEach((product) => {
      datasets.push({
        label: product.title, // Use the product title as the dataset label
        data: categories.map(
          (cat) => (cat === category ? product.quantity : 0) // Only show quantity for the relevant category
        ),
        backgroundColor:
          product.quantity < lowStockThreshold
            ? "rgba(255, 0, 0, 0.7)"
            : "rgba(54, 162, 235, 0.6)", // Conditional coloring
        borderColor:
          product.quantity < lowStockThreshold
            ? "rgba(255, 99, 132, 1)"
            : "rgba(54, 162, 235, 1)", // Conditional border
        borderWidth: 1,

        datalabels: {
          // Configure data labels
          anchor: "end", // Position data labels at the end of the bar
          align: "end", // Align labels to the end
          formatter: (value, context) => {
            const quantity =
              context.chart.data.datasets[context.datasetIndex].data[
                context.dataIndex
              ];
            return quantity > 0
              ? context.chart.data.datasets[context.datasetIndex].label
              : null; // Hide label if quantity is 0
          },
          color: "Black", // Label color
          font: {
            size: 14, // Label font size
            weight: "bold", // Label font weight
          },
          rotation: -90,
          product,
        },
      });
    });
  });

  // Chart data structure
  const stockData = {
    labels: categories, // Categories like "Foods", "Fans", etc. as x-axis labels
    datasets: datasets, // Each product as a separate dataset
  };

  // Chart options
  const options = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 25, // Adjust step size for better visibility
          color: "#333", // Change tick color for better contrast
        },
      },
    },
    plugins: {
      legend: {
        position: "bottom", // Position the legend at the bottom
      },
      // Add annotation for low stock threshold line
      annotation: {
        annotations: {
          lowStockLine: {
            type: "line",
            yMin: lowStockThreshold,
            yMax: lowStockThreshold,
            borderColor: "rgba(255, 0, 0, 0.7)", // Red line for low stock
            borderWidth: 2,
            label: {
              content: "Low Stock Level",
              enabled: true,
              position: "center",
              backgroundColor: "rgba(255, 0, 0, 0.7)",
              color: "black",
              font: {
                size: 24,
                weight: "bold",
              },
            },
          },
        },
      },
      datalabels: {
        anchor: "center", // Center anchor for all data labels
        align: "center", // Align labels to center
      },
    },
  };

  return (
    <div className=" bg-gray-50 rounded-lg shadow-lg p-32">
         <Link className="flex justify-start" to="/dashboard?tab=products">
          <Button gradientDuoTone="purpleToBlue" outline>
            Back to Products
          </Button>
        </Link>
      
      <h2 className="text-2xl text-center font-semibold pb-8 text-gray-800 mb-4">
        Inventory Stock Summary by Category/Products
      </h2>
      <Bar
        className="border rounded-lg shadow-lg p-16"
        data={stockData}
        options={options}
      />{" "}
      {/* Grouped bar chart */}
    </div>
  );
}
