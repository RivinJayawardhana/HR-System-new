import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { useState } from "react";
import 'react-quill/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from "../firebase";
import { useNavigate, useParams } from "react-router-dom";

export default function Updatestaff() {
    const [formData, setFormData] = useState({});
    const [publishError, setPublishError] = useState(null);
    const[file,setFile]=useState(null);
    const[imageUploadProgress,setImageUploadProgress] = useState(null);
    const[imageUploadError,setImageUploadError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUploadImage = () =>{
        try {
          if(!file){
            setImageUploadError('please select an image');
            return;
          }
          setImageUploadError(null);
          const storage = getStorage(app);
          const fileName = new Date().getTime()+'-'+file.name;
          const storageRef = ref(storage,fileName);
          const uploadTask = uploadBytesResumable(storageRef,file);
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setImageUploadProgress(progress.toFixed(0));
            },
            
            (error) => {
              setImageUploadError("Image upload failed");
              console.error("Upload error:", error);
              setImageUploadProgress(null);
             
            },
            () => {
              //from the firebase
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>{
                setImageUploadProgress(null);
                setImageUploadError(null);
                setFormData({...formData, document1: downloadURL});
              }
               
              );
            }
          );
    
        } catch (error) {
          setImageUploadError('Failed to upload image');
          setImageUploadProgress(null);
          console.log(error);
        }
      }
    

    const uploadFile = async () => {
        if (!file) return null;

        const storage = getStorage(app);
        const storageRef = ref(storage, `uploads/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        return new Promise((resolve, reject) => {
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(progress);
                },
                (error) => {
                    console.error("File upload error:", error);
                    setPublishError("Failed to upload file");
                    reject(error);
                },
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    resolve(downloadURL);
                }
            );
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let fileURL = null;
        if (file) {
            fileURL = await uploadFile();
        }

        const dataToSubmit = {
            ...formData,
            userId: id,
            file: fileURL, // Add file URL to form data
        };

        try {
            const res = await fetch(`/api/form/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataToSubmit),
            });
            const data = await res.json();
            if (!res.ok) {
                setPublishError(data.message);
                return;
            }

            if (res.ok) {
                setPublishError(null);
                navigate(`/`);
            }
        } catch (error) {
            setPublishError("Something went wrong");
        }
    };

    return (
        <div className="p-3 max-w-3xl mx-auto min-h-screen">
            <h1 className="text-center text-3xl my-7 font-semibold">Personal History Form</h1>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <TextInput
                    type="text"
                    placeholder="Full Name"
                    required
                    className="flex-1"
                    onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                />
                <TextInput
                    type="text"
                    placeholder="Address"
                    required
                    className="flex-1"
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
                <TextInput
                    type="text"
                    placeholder="Phone number"
                    required
                    className="flex-1"
                    onChange={(e) => setFormData({ ...formData, contactno: e.target.value })}
                />
                <TextInput
                    type="text"
                    placeholder="NIC number"
                    required
                    className="flex-1"
                    onChange={(e) => setFormData({ ...formData, nic: e.target.value })}
                />
                <label>Date of Birth</label>
                <TextInput
                    type="date"
                    required
                    className="flex-1"
                    onChange={(e) => setFormData({ ...formData, dateofbirth: e.target.value })}
                />
                <label>Date of Join</label>
                <TextInput
                    type="date"
                    required
                    className="flex-1"
                    onChange={(e) => setFormData({ ...formData, DateofJoin: e.target.value })}
                />
                <label>CDC Account</label>
                <Select onChange={(e) => setFormData({ ...formData, CDSDetails: e.target.value })}>
                    <option value="yes">yes</option>
                    <option value="no">no</option>
                </Select>

                <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
                <FileInput
  type="file"
  accept="application/pdf"
  onChange={(e) => setFile(e.target.files[0])}
/>
            <Button onClick={handleUploadImage} type='button'gradientDuoTone='purpleToBlue'size='sm' outline disabled={imageUploadProgress}>
              {
                imageUploadProgress ?(
                <div className="w-16 h-16" >
                  <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}`}/>
                </div>
                ) :('Upload File')

              }
            </Button>
          </div>
        
        {imageUploadError && (
          <Alert color='failure'>{imageUploadError}</Alert>
        )}
        {formData.image && (
          <img src={formData.image} alt="upload" className="w-full h-82 object-cover"/>
        )}

                <Button type="submit" gradientDuoTone="purpleToBlue">
                    Submit
                </Button>
                {publishError && (
                    <Alert className="mt-5" color="failure">
                        {publishError}
                    </Alert>
                )}
            </form>
        </div>
    );
}
