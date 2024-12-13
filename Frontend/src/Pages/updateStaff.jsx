
import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { useState,useEffect } from "react";
import 'react-quill/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from "../firebase";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate,useParams } from "react-router-dom";

export default function Updatestaff() {
    const[file,setFile]=useState(null);
    const[imageUploadProgress,setImageUploadProgress] = useState(null);
    const[imageUploadError,setImageUploadError] = useState(null);
    const [formData , setFormData] = useState({});
    const [publishError, setPublishError] = useState(null);
    const [name,setname] = useState ([]);
    const [email,setemail] = useState ([]);
    const [number,setnumber] = useState ([]);
    const [posision,setposision] = useState ([]);
    const [password,setpassword] = useState ([]);

    
    

    

  const { id } = useParams();

  const navigate = useNavigate();
 
 



  useEffect(() => {
    try {
      const fetstaff= async () => {
        const res = await fetch(`/api/staff/getmember/${id}`);
        const data = await res.json();
        if (!res.ok) {
          console.log("error")
      
          return;
        }
        if (res.ok) {
            
            setname(data.Staffmembername)
            setemail(data.username)
            setposision(data.position)
            setnumber(data.contactNumber)
            setpassword(data.password)

            console.log(data)
        
         }
      };

      fetstaff();
    } catch (error) {
      console.log(error.message[0]);
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/staff/updatemember/${id}`, {
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
      console.log(formData);

      if (res.ok) {
        setPublishError(null);
        navigate(`/dashboard?tab=staff`);
      }
    } catch (error) {
      setPublishError('Something went wrong');
    }
  };
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
        <h1 className="text-center text-3xl my-7 font-semibold">Update Staff Member</h1>
        <form className="flex flex-col  gap-4" onSubmit={handleSubmit}>
        
         
        
       
        <TextInput type='text'placeholder='Member Name'required id='Member Name'className='flex-1'  onChange={(e) =>
              setFormData({ ...formData, Staffmembername: e.target.value })
            } defaultValue={name}/>
       
           
            <TextInput type='text'placeholder='email'required id='User Name'className='flex-1'  onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            } defaultValue={email}/>


<TextInput type='text'placeholder='contact Number'required id='Password'className='flex-1'  onChange={(e) =>
              setFormData({ ...formData, contactNumber: e.target.value })
            } defaultValue={number}/>
           
           <TextInput type='text'placeholder='position'required id='Password'className='flex-1'  onChange={(e) =>
              setFormData({ ...formData, position: e.target.value })
            } defaultValue={posision}/>
            <TextInput type='password'placeholder='password'required id='Password'className='flex-1'  onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            } defaultValue={password}/>
            
        <Button type='submit' className="bg-black text-white">Add</Button>
        {publishError && (
          <Alert className='mt-5' color='failure'>
            {publishError}
          </Alert>
        )}
        </form>
    </div>
  )
}