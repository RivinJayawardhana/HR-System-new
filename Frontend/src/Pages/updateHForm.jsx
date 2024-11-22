
import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { useState,useEffect } from "react";
import 'react-quill/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from "../firebase";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate,useParams } from "react-router-dom";

export default function UpdateHform() {
    const [formData , setFormData] = useState({});
    const [publishError, setPublishError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const [formdetails,setformdetails] = useState([])
    const [publishError, setPublishError] = useState(null);
    const [publishError, setPublishError] = useState(null);
    const [publishError, setPublishError] = useState(null);



    useEffect(() => {
      const fetchs = async () => {
        try {
          const res = await fetch(`/api/form/get/${id}`);
          const data = await res.json();
          if (res.ok) {
            setformdetails(data);
            console.log(data)
           
          }
        } catch (error) {
          console.log(error.message);
        }
      };
       fetchs();
     
    }, []);










  
 
 const handleSubmit = async (e) => {
    
   
    e.preventDefault();
    setFormData({
        ...formData, // Keep existing form fields
        userId: id, // Update the current field
      });
    try {
      
      const res = await fetch(`/api/form/add`, {
        method: 'POST',
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
      console.log(formData);

      if (res.ok) {
        setPublishError(null);
        navigate(`/`);
      }
    } catch (error) {
      setPublishError('Something went wrong');
    }
  };
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
        <h1 className="text-center text-3xl my-7 font-semibold">Personal History Form</h1>
        <form className="flex flex-col  gap-4" onSubmit={handleSubmit}>
        
       
      
        <TextInput type='text'placeholder='Full Name'required id='Member Name'className='flex-1'  onChange={(e) =>
              setFormData({ ...formData, fullname: e.target.value })
            
            } />
       
            <TextInput type='text'placeholder='Address'required id='Age'className='flex-1'  onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            } />
            <TextInput type='text'placeholder='Phone number'required id='Phone number'className='flex-1'  onChange={(e) =>
              setFormData({ ...formData, contactno: e.target.value })
            } />
     <TextInput type='text'placeholder='NIC number'required id='Phone number'className='flex-1'  onChange={(e) =>
              setFormData({ ...formData, nic: e.target.value })
            } />
             <label>Date of Birth </label>

<TextInput type='date'placeholder='Date of Birth'required id='Phone number'className='flex-1'  onChange={(e) =>
              setFormData({ ...formData, dateofbirth: e.target.value })
            } />
             <label>Date of Join</label>
            <TextInput type='date'placeholder='Date of Join'required id='Phone number'className='flex-1'  onChange={(e) =>
              setFormData({ ...formData, DateofJoin: e.target.value })
            } />

            <label>CDC Account </label>
             <Select onChange={(e) => setFormData({ ...formData, CDSDetails: e.target.value })} >
            <option value='yes'>yes</option>
            <option value='no'>no</option>

          </Select>
            
        <Button type='submit' gradientDuoTone='purpleToBlue'>Update</Button>
        {publishError && (
          <Alert className='mt-5' color='failure'>
            {publishError}
          </Alert>
        )}
        </form>
    </div>
  )
}