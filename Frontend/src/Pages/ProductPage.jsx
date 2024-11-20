import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/cart/cartSlice';
import 'aos/dist/aos.css';
import AOS from 'aos';

export default function ProductPage() {
  const location = useLocation();
  const { category } = queryString.parse(location.search);
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(category || '');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [notification, setNotification] = useState({ visible: false, message: '' });
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.currentUser);

  const categories = ['All', 'Foods', 'ReadingTable', 'Beds', 'Fans'];

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm, selectedCategory]);

  const fetchProducts = async () => {
    try {
      const res = await fetch(
        `/api/products/getproducts?searchTerm=${searchTerm}&page=${currentPage}&category=${selectedCategory}&priceRange=${selectedPriceRange}`
      );
      const data = await res.json();
      if (res.ok) {
        setProducts(data.products);
        setTotalProducts(data.totalProducts);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat === 'All' ? '' : cat); // Clear category for 'All'
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handlePriceRangeChange = (range) => {
    setSelectedPriceRange(range);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm, selectedCategory, selectedPriceRange]);

  const handleAddToCart = (product) => {
    if (product.quantity <= 0) {
      showNotification('Product is out of stock');
      return;
    }

    if (user) {
      dispatch(addToCart({ product, userId: user.id }));
      showNotification('Product added to the cart');
    } else {
      console.log('User not logged in');
    }
  };

  const handleBuyNow = (product) => {
    if (product.quantity <= 0) {
      showNotification('Product is out of stock');
      return;
    }

    // Redirect to purchase form logic
    console.log('Proceed to buy product:', product.title);
  };

  const showNotification = (message) => {
    setNotification({ visible: true, message });
    setTimeout(() => {
      setNotification({ visible: false, message: '' });
    }, 3000);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold">
          Explore top-quality Products and Foods for all your needs at Hostel Management Application
        </h2>
      </div>

      <div className="flex">
        <aside className="w-1/4 p-4 border-r">
          <h3 className="text-xl font-semibold mb-4">Filters</h3>
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-2">Categories</h4>
            <ul>
              {categories.map((cat) => (
                <li key={cat}>
                  <button
                    className={`text-left block w-full px-2 py-1 mb-1 rounded ${
                      selectedCategory === cat ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'
                    }`}
                    onClick={() => handleCategoryChange(cat)}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-bold mb-4">Price Range</h2>
            <ul>
              {['3000-5000', '5001-10000', '10001-50000', '50001-100000'].map(range => (
                <li
                  key={range}
                  onClick={() => handlePriceRangeChange(range)}
                  className={`cursor-pointer mb-2 ${selectedPriceRange === range ? 'bg-gray-200' : ''}`}
                >
                  Rs. {range.split('-')[0]} - Rs. {range.split('-')[1]}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <main className="w-3/4 p-4">
          <div className="mb-4 w-52">
            <input
              type="text"
              placeholder="Search by product name..."
              className="w-full px-4 py-2 border rounded"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product._id} className="border rounded-lg shadow-lg p-4">
                <Link to={`/product/${product.slug}`}>
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-40 object-cover mb-4"
                  />
                </Link>
                <h3 className="text-lg font-semibold text-center mb-2">
                  <Link to={`/product/${product.slug}`}>{product.title}</Link>
                </h3>
                <p className="text-center text-blue-800 font-semibold">{product.description}</p>
                <p className="text-center text-gray-600">Price: Rs. {product.price}</p>
                {product.quantity <= 0 ? (
                  <p className="text-center text-red-600 font-semibold">Out of Stock</p>
                ) : product.quantity < 10 ? (
                  <p className="text-center text-yellow-600 font-semibold">Low Stock</p>
                ) : null}
                <div className="flex justify-center mt-4 space-x-2">

                  <button
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                    onClick={() => handleBuyNow(product)}
                    disabled={product.quantity <= 0}
                  >
                    Buy Now
                  </button>

                  <button
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                    onClick={() => handleAddToCart(product)}
                    disabled={product.quantity <= 0}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="mx-2 px-4 py-2  bg-indigo-200 hover:bg-indigo-300 rounded"
            >
              Previous
            </button>
            <span className="mx-2 px-4 py-2">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="mx-2 px-4 py-2 bg-indigo-200 hover:bg-indigo-300 rounded"
            >
              Next
            </button>
          </div>
        </main>
      </div>

      {notification.visible && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white py-2 px-4 rounded">
          {notification.message}
        </div>
      )}
    </div>
  );
}
