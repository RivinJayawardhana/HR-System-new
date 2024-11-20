import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Alert, Button, TextInput } from 'flowbite-react';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/cart/cartSlice';

export default function PostProduct() {
  const { productSlug } = useParams();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [notification, setNotification] = useState({ visible: false, message: '' });
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/getproducts?slug=${productSlug}`);

        if (!res.ok) {
          const errorMessage = await res.text();
          setError(errorMessage);
          setLoading(false);
          return;
        }

        const data = await res.json();
        if (data.products.length === 0) {
          setError('Product not found');
          setLoading(false);
          return;
        }

        setProduct(data.products[0]);

        // Fetch similar products
        const similarRes = await fetch(`/api/products/category?category=${data.products[0].category}`);
        const similarData = await similarRes.json();
        setSimilarProducts(similarData.products);

        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productSlug]);

  const handleQuantityChange = (amount) => {
    setQuantity((prev) => Math.max(1, prev + amount));
  };

  const handleAddToCart = () => {
    if (user) {
      dispatch(addToCart({ product, userId: user.id }));
      showNotification('Product added to the cart');
    } else {
      console.log('User not logged in');
    }
  };

  const showNotification = (message) => {
    setNotification({ visible: true, message });
    setTimeout(() => {
      setNotification({ visible: false, message: '' });
    }, 3000);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <Alert color="failure">{error}</Alert>;
  }

  const isOutOfStock = product.quantity <= 0;

  return (
    <div className="p-3 max-w-5xl mx-auto min-h-screen">
      {notification.visible && (
        <div className="fixed top-0 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow-md">
          {notification.message}
        </div>
      )}
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="flex flex-col gap-4 sm:w-1/3">
          {product.images &&
            product.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Product Image ${index + 1}`}
                className={`cursor-pointer ${
                  index === mainImageIndex ? 'border-4 border-teal-500' : 'border'
                }`}
                onClick={() => setMainImageIndex(index)}
              />
            ))}
        </div>
        <div className="sm:w-2/3">
          <img src={product.images[mainImageIndex]} alt={product.title} className="w-full h-82 object-cover" />
          <h1 className="text-3xl my-7 font-semibold">{product.title}</h1>
          <div className="flex items-center mt-4 gap-2">
            <div className="gap-4 sm:flex-row justify-between mt-4">
              Price: Rs. {product.price}
            </div>
            <Button className="bg-slate-400" onClick={() => handleQuantityChange(-1)} disabled={isOutOfStock}>
              <FaMinus />
            </Button>
            <TextInput
              type="number"
              value={quantity}
              min="1"
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
              className="w-16 text-center"
              disabled={isOutOfStock}
            />
            <Button className="bg-slate-400" onClick={() => handleQuantityChange(1)} disabled={isOutOfStock}>
              <FaPlus />
            </Button>
          </div>
          <p>{product.description}</p>

          {isOutOfStock ? (
            <p className="text-red-600 font-semibold mt-4">Out of Stock</p>
          ) : (
            <div className="flex justify-center gap-4 mt-4">
              <button
                className="block w-full text-center py-2 mt-2 bg-slate-200 border border-slate-200 text-black hover:bg-slate-400 rounded hover:border-slate-300 hover:text-white hover:font-semibold"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
              <Button className="bg-slate-400">Buy Product</Button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Similar Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {similarProducts.length > 0 ? (
            similarProducts.map((similarProduct, index) => (
              <Link key={index} to={`/product/${similarProduct.slug}`}>
                <div className="border p-4 rounded-md">
                  <img
                    src={similarProduct.images[0]}
                    alt={similarProduct.title}
                    className="w-full h-48 object-cover mb-4"
                  />
                  <h3 className="text-lg font-semibold">{similarProduct.title}</h3>
                  <span>Price: Rs. {similarProduct.price}</span>
                </div>
              </Link>
            ))
          ) : (
            <div>No similar products found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
