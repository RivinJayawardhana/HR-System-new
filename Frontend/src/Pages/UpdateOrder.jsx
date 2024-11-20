import { Alert, Button, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";


import { useNavigate , useParams} from "react-router-dom";

export default function UpdateOrder() {
    const [formData , setFormData] = useState({});
    const [publishError, setPublishError] = useState(null);
    const { id } = useParams();

    const navigate = useNavigate();
    // const { currentUser } = useSelector((state) => state.user);

    //fetch relevant order using id
        useEffect(() => {
            try {
            const fetchOrder = async () => {
                const res = await fetch(`/api/order/getorder/${id}`);
                const data = await res.json();
                if (!res.ok) {
                console.log(res);
                }
                if (res.ok) {
                    console.log(data);
                //   setFormData(data.orders[0]);
                setFormData(data);
                }
            };
        
            fetchOrder();
            } catch (error) {
            console.log(error.message);
            }
        }, [id]);

      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/order/updateorder/${formData._id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
          const data = await res.json();
          if (!res.ok) {
            setPublishError(data.message);
            return;
          }
    
          if (res.ok) {
            setPublishError(null);
            navigate('/dashboard?tab=recived_orders');
          }
        } catch (error) {
          setPublishError('Something went wrong');
        }
      };

  return (
    <div className="p-3 mx-auto">
        <h1 className="text-center text-3xl my-7 font-semibold">Update Order</h1>
        <form className="flex max-w-3xl flex-col mx-auto pb-10" onSubmit={handleSubmit} >
            <div className='flex flex-col justify-center'>
                <div>
                    <label>First Name</label>
                    <TextInput type='text' required id='first_name' className='p-2 mb-2' onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} value={formData.first_name} placeholder="First Name"/>
                    <label>Last Name</label>
                    <TextInput type='text' required id='last_name' className='p-2 mb-2' onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} value={formData.last_name} placeholder="Last Name"/>
                    <label>Email</label>
                    <TextInput type='text' required id='email' className='p-2 mb-2' onChange={(e) => setFormData({ ...formData, email: e.target.value })} value={formData.email} placeholder="Email"/>
                    <label>Phone</label>
                    <TextInput type='text' required id='phone' className='p-2' onChange={(e) => setFormData({ ...formData, phone: e.target.value })} value={formData.phone} placeholder="Phone"/>
                </div>
                <div >
                    <label>Address</label>
                    <TextInput type='text' required id='address' className='p-2 mb-2' onChange={(e) => setFormData({ ...formData, address: e.target.value })} value={formData.address} placeholder="Address"/>
                    <label>Province</label>
                    <TextInput type='text' required id='state' className='p-2 mb-2' onChange={(e) => setFormData({ ...formData, state: e.target.value })} value={formData.state} placeholder="State"/>
                    <label>Zip code</label>
                    <TextInput type='text' required id='zip' className='p-2 mb-2' onChange={(e) => setFormData({ ...formData, zip: e.target.value })} value={formData.zip} placeholder="ZIP"/>
                    <label>Total Cost of the order</label>
                    <TextInput type='text' required id='totalcost' className='p-2' onChange={(e) => setFormData({ ...formData, totalcost: e.target.value })} value={formData.totalcost} placeholder="Total Cost" readOnly/>
                    <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Status of the Order
                    </label>
                    <Select 
                    id="status" 
                    required 
                    className="w-full text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    onChange={(e) => setFormData({ ...formData, status: e.target.value === 'true' })} 
                    value={formData.status}
                    >
                    <option value="">Select Status</option>
                    <option value={true}>Completed</option>
                    <option value={false}>Pending</option>
                    </Select>

                </div>
            </div>
            <button type='submit' className="bg-indigo-500 hover:bg-indigo-600 text-white p-3 rounded-lg mt-5">Update order</button>
            {publishError && (
            <Alert className='mt-5' color='failure'>
                {publishError}
            </Alert>
            )}
            </form>

    </div>
  )
}