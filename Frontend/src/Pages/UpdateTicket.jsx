import { Alert, Button, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";


import { useNavigate , useParams} from "react-router-dom";

export default function UpdateTicket() {
    const [formData , setFormData] = useState({});
    const [publishError, setPublishError] = useState(null);
    const { id } = useParams();

    const navigate = useNavigate();
    //const { currentUser } = useSelector((state) => state.user);

    //fetch relevant Ticket using id
    useEffect(() => {
        const fetchTicket = async () => {
          try {
            const res = await fetch(`/api/ticket/get_a_ticket/${id}`); // Make sure your base URL is correct
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
      
        fetchTicket();
      }, [id]);
      

      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/ticket/update_ticket/${formData._id}`, {
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
            navigate('/dashboard?tab=support-desk');
          }
        } catch (error) {
            console.log(error)
          setPublishError('Something went wrong');
        }
      };

  return (
    <div className="p-3 mx-auto">
        <h1 className="text-center text-3xl my-7 font-semibold">Update Ticket</h1>
        <form className="flex max-w-3xl flex-col mx-auto pb-10" onSubmit={handleSubmit} >
            <div className='flex flex-col justify-center'>
                <div>
                    {/* <TextInput type='text' required id='userId' className='p-2 mb-2' onChange={(e) => setFormData({ ...formData, _id: e.target.value })} value={formData._id} placeholder="id" /> */}
                    {/* <TextInput type='text' required id='userId' className='p-2 mb-2' onChange={(e) => setFormData({ ...formData, userId: e.target.value })} value={formData.userId} placeholder="User ID" readOnly/> */}
                    {/* <TextInput type='text' required id='orderId' className='p-2 mb-2' onChange={(e) => setFormData({ ...formData, orderId: e.target.value })} value={formData.orderId} placeholder="Order ID" readOnly/> */}
                    <label className="font-semibold">Student Id</label>
                    <TextInput type='text' required id='first_name' className='p-2 mb-2' onChange={(e) => setFormData({ ...formData, studentId: e.target.value })} value={formData.studentId} placeholder="Student Name" readOnly/>
                    
                    <label className="font-semibold">Student Name</label>
                    <TextInput type='text' required id='email' className='p-2 mb-2' onChange={(e) => setFormData({ ...formData, studentName: e.target.value })} value={formData.studentName} placeholder="Room Number" readOnly/>
                    
                    <label className="font-semibold">Email</label>
                    <TextInput type='text' required id='last_name' className='p-2 mb-2' onChange={(e) => setFormData({ ...formData, email: e.target.value })} value={formData.email} placeholder="Email" readOnly/>
                    
                    <label className="font-semibold">Issue Type</label>
                    <TextInput type='text' required id='no_id' className='p-2 mb-2' onChange={(e) => setFormData({ ...formData, issueType: e.target.value })} value={formData.issueType} placeholder="Room Number" readOnly/>
                    
                    <label className="font-semibold">Title</label>
                    <TextInput type='text' required id='no_id' className='p-2 mb-2' onChange={(e) => setFormData({ ...formData, title: e.target.value })} value={formData.title} placeholder="Room Number" readOnly/>
                    
                    <label className="font-semibold">Description</label>
                    <TextInput type='text' required id='no_id' className='p-2 mb-2' onChange={(e) => setFormData({ ...formData, description: e.target.value })} value={formData.description} placeholder="Room Number" readOnly/>
                    
                    <label className="font-semibold">Reply</label>
                    <TextInput type='text' required id='no_id' className='p-2 mb-2' onChange={(e) => setFormData({ ...formData, reply: e.target.value })} value={formData.reply} placeholder="Date"/>
                    
                    <label className="font-semibold">Status</label>
                    <Select
                        id="status"
                        required
                        className="p-2 mb-2"
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        value={formData.status}
                        >
                        <option value="" disabled>
                            Select Status
                        </option>
                        <option value="false">In Progress</option>
                        <option value="true">Completed</option>
                    </Select>    
{/*                     
                    <label className="font-semibold">Put Feedback</label>
                    <TextInput type='text' required id='phone' className='p-2' onChange={(e) => setFormData({ ...formData, commentsAdmin: e.target.value })} value={formData.commentsAdmin} placeholder="Comments"/> */}
                </div>
                
            </div>
            <button type='submit' className="bg-indigo-500 hover:bg-indigo-600 p-3 rounded-lg text-white " >Update Ticket</button>
            {publishError && (
            <Alert className='mt-5' color='failure'>
                {publishError}
            </Alert>
            )}
            </form>

    </div>
  )
}