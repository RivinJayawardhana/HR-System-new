import { Alert, Button, Select, Textarea, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";


import { useNavigate , useParams} from "react-router-dom";

export default function UpdateCommentUser() {
    const [formData , setFormData] = useState({});
    const [publishError, setPublishError] = useState(null);
    const { id } = useParams();

    const navigate = useNavigate();
    //const { currentUser } = useSelector((state) => state.user);

    //fetch relevant request using id
    useEffect(() => {
        const fetchRequest = async () => {
          try {
            const res = await fetch(`/api/request/get_request/${id}`); // Make sure your base URL is correct
            const data = await res.json();
            if (!res.ok) {
              console.log(res);
            } else {
                console.log(data);
              setFormData(data); // Assuming data contains the document's details
            }
          } catch (error) {
            console.error("Error fetching the record:", error);
          }
        };
      
        fetchRequest();
      }, [id]);
      

      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/request/add_comment_stu/${formData._id}`, {
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
            navigate('/dashboard?tab=my_requests');
          }
        } catch (error) {
            console.log(error)
          setPublishError('Something went wrong');
        }
      };

  return (
    <div className="p-3 mx-auto">
        <h1 className="text-center text-3xl my-7 font-semibold">Put comment on cleaning service</h1>
        <form className="flex max-w-3xl flex-col mx-auto pb-10" onSubmit={handleSubmit} >
            <div className='flex flex-col justify-center'>
                <div>
                    {/* <TextInput type='text' required id='userId' className='p-2 mb-2' onChange={(e) => setFormData({ ...formData, _id: e.target.value })} value={formData._id} placeholder="id" /> */}
                    {/* <TextInput type='text' required id='userId' className='p-2 mb-2' onChange={(e) => setFormData({ ...formData, userId: e.target.value })} value={formData.userId} placeholder="User ID" readOnly/> */}
                    {/* <TextInput type='text' required id='orderId' className='p-2 mb-2' onChange={(e) => setFormData({ ...formData, orderId: e.target.value })} value={formData.orderId} placeholder="Order ID" readOnly/> */}
                    <label className="font-semibold">Your Name</label>
                    <TextInput type='text' required id='first_name' className='p-2 mb-2' onChange={(e) => setFormData({ ...formData, name: e.target.value })} value={formData.name} placeholder="Student Name" readOnly/>
                    
                    <label className="font-semibold">Email</label>
                    <TextInput type='text' required id='last_name' className='p-2 mb-2' onChange={(e) => setFormData({ ...formData, email: e.target.value })} value={formData.email} placeholder="Email" readOnly/>
                    
                    <label className="font-semibold">Room Number</label>
                    <TextInput type='text' required id='email' className='p-2 mb-2' onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })} value={formData.roomNumber} placeholder="Room Number" readOnly/>
                    
                    <label className="font-semibold">Date</label>
                    <TextInput type='date' required id='email' className='p-2 mb-2' onChange={(e) => setFormData({ ...formData, date: e.target.value })} value={formData.date} placeholder="Date" readOnly/>  
                    
                    <label className="font-semibold">Add comment on cleaning service</label>
                    <Textarea
                        id="commentsAdmin"
                        required
                        className="p-2"
                        onChange={(e) => setFormData({ ...formData, commentsUser: e.target.value })}
                        value={formData.commentsUser}
                        placeholder="Comments"
                        />
                </div>
                
            </div>
            <button type='submit' className="bg-indigo-500 hover:bg-indigo-600 p-3 rounded-lg text-white mt-5" >Add Comment</button>
            {publishError && (
            <Alert className='mt-5' color='failure'>
                {publishError}
            </Alert>
            )}
            </form>

    </div>
  )
}