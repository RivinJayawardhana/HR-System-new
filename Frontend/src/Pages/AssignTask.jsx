
import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { useState,useEffect } from "react";
import 'react-quill/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from "../firebase";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate,useParams } from "react-router-dom";

export default function AssignTask() {
 
    const [formData , setFormData] = useState({});
    const [publishError, setPublishError] = useState(null);

    const[task,settask]=useState();
   
    

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
            
            settask(data.task)
         

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
        <h1 className="text-center text-3xl my-7 font-semibold">Assign task</h1>
        <form className="flex flex-col  gap-4" onSubmit={handleSubmit}>
        
          
            <TextInput type='text'placeholder='Task'required id='pos'className='flex-1'  onChange={(e) =>
              setFormData({ ...formData, task: e.target.value })
            } defaultValue={task}/>
            
            
        <Button type='submit' gradientDuoTone='purpleToBlue'>Assign</Button>
        {publishError && (
          <Alert className='mt-5' color='failure'>
            {publishError}
          </Alert>
        )}
        </form>
    </div>
  )
}