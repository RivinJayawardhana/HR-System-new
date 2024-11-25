
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
  const [fid, setfid] = useState(null); // User ID (can be fetched or generated)
  const [fullname, setFullname] = useState("");
  const [address, setAddress] = useState("");
  const [contactno, setContactno] = useState("");
  const [dateofbirth, setDateofbirth] = useState("");
  const [NIC, setNIC] = useState("");
  const [DateofJoin, setDateofJoin] = useState("");
  const [CDSDetails, setCDSDetails] = useState("");
  const [status, setStatus] = useState(""); // Default status
  

  useEffect(() => {
      const fetchs = async () => {
        try {
          const res = await fetch(`/api/form/get/${id}`);
          const data = await res.json();
          if (res.ok) {
            setfid(data._id);
            setFullname(data.fullname);
            setAddress(data.address);
            setContactno(data.contactno);
            setDateofbirth(data.dateofbirth);
            setNIC(data.NIC);
            setDateofJoin(data.DateofJoin);
            setCDSDetails(data.CDSDetails);
            setStatus(data.status)
            
           
            setFormData({ ...formData, userId: id});
           
           
          }
        } catch (error) {
          console.log(error.message);
        }
      };
       fetchs();
     
    }, [fid]);


 const handleSubmit = async (e) => {
      e.preventDefault();
     console.log(fid);
      
try {
      
      const res = await fetch(`/api/form/update/${fid}`, {
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
        navigate(`/userdash/${id}`);
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
        
            } defaultValue={fullname} />
       
            <TextInput type='text'placeholder='Address'required id='Age'className='flex-1'  onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }  defaultValue={address} />
            <TextInput type='text'placeholder='Phone number'required id='Phone number'className='flex-1'  onChange={(e) =>
              setFormData({ ...formData, contactno: e.target.value })
            }  defaultValue={contactno}/>
     <TextInput type='text'placeholder='NIC number'required id='Phone number'className='flex-1'  onChange={(e) =>
              setFormData({ ...formData, nic: e.target.value })
            }  defaultValue={NIC} />
             <label>Date of Birth </label>

<TextInput type='date'placeholder='Date of Birth'required id='Phone number'className='flex-1'  onChange={(e) =>
              setFormData({ ...formData, dateofbirth: e.target.value })
            }  defaultValue={dateofbirth} />
             <label>Date of Join</label>
            <TextInput type='date'placeholder='Date of Join'required id='Phone number'className='flex-1'  onChange={(e) =>
              setFormData({ ...formData, DateofJoin: e.target.value })
            }  defaultValue={DateofJoin}/>

            <label>CDC Account </label>
             <Select onChange={(e) => setFormData({ ...formData, CDSDetails: e.target.value })} defaultValue={CDSDetails} >
    
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