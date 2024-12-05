import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { useState } from "react";
import 'react-quill/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from "../firebase";
import { CircularProgressbar } from 'react-circular-progressbar';
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateStaff() {
    const [formData, setFormData] = useState({
      academicQualifications: [],
      previousEmploymentDetails: [],
      spouseDetails: [],
      emergencyContact: []
    });
    const [publishError, setPublishError] = useState(null);
    const [file, setFile] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUploadImage = () => {
        try {
            if (!file) {
                setImageUploadError('Please select a file');
                return;
            }
            setImageUploadError(null);
            const storage = getStorage(app);
            const fileName = new Date().getTime() + '-' + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setImageUploadProgress(progress.toFixed(0));
                },
                (error) => {
                    setImageUploadError("File upload failed");
                    console.error("Upload error:", error);
                    setImageUploadProgress(null);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setImageUploadProgress(null);
                        setImageUploadError(null);
                        setFormData({ ...formData, document1: downloadURL });
                    });
                }
            );

        } catch (error) {
            setImageUploadError('Failed to upload file');
            setImageUploadProgress(null);
            console.log(error);
        }
    };

    const handleAddQualification = () => {
        setFormData({
            ...formData,
            academicQualifications: [...formData.academicQualifications, { qualification: "", universityInstitute: "", status: "" }]
        });
    };

    const handleAddEmployment = () => {
        setFormData({
            ...formData,
            previousEmploymentDetails: [...formData.previousEmploymentDetails, { employer: "", Natureofbusiness: "", Positionheld: "",Lengthofservice: "" }]
        });
    };

    const handleAddSpouseDetails = () => {
        setFormData({
            ...formData,
            spouseDetails: [...formData.spouseDetails, { name: "", ID: "", placeOfWork: "", positionHeld: "" }]
        });
    };

    const handleAddemergencyContact = () => {
      setFormData({
          ...formData,
          emergencyContact: [...formData.emergencyContact, { name: "", relationship: "", contactNo: ""  }]
      });
  };


    const handleSubmit = async (e) => {
        e.preventDefault();

        let fileURL = null;
        if (file) {
            const storage = getStorage(app);
            const storageRef = ref(storage, `uploads/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            fileURL = await new Promise((resolve, reject) => {
                uploadTask.on(
                    "state_changed",
                    null,
                    reject,
                    async () => {
                        resolve(await getDownloadURL(uploadTask.snapshot.ref));
                    }
                );
            });
        }

        const dataToSubmit = {
            ...formData,
            userId: id,
          
        
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

            setPublishError(null);
            navigate(`/`);
        } catch (error) {
            setPublishError("Something went wrong");
        }
    };

    return (
        <div className="p-3 max-w-3xl mx-auto min-h-screen">
            <h1 className="text-center text-3xl my-7 font-semibold">Personal History Form</h1>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                {/* General Inputs */}
                <TextInput
                    type="text"
                    placeholder="Full Name"
                    required
                    onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                />
                <TextInput
                    type="text"
                    placeholder="Address"
                    required
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
                <TextInput
                    type="text"
                    placeholder="Phone number"
                    required
                    onChange={(e) => setFormData({ ...formData, contactno: e.target.value })}
                />
                 
                <TextInput
                    type="text"
                    placeholder="NIC number"
                    required
                    onChange={(e) => setFormData({ ...formData, NIC: e.target.value })}
                />

<TextInput
                    type="text"
                    placeholder="civil Status"
                    required
                    onChange={(e) => setFormData({ ...formData, civilStatus: e.target.value })}
                />

                <label>Bank Details</label>
                <TextInput
                    type="text"
                    placeholder="Bank Name"
                    required
                    onChange={(e) => setFormData({ ...formData, civilStatus: e.target.value })}
                />
                <TextInput
                    type="number"
                    placeholder="Account Number"
                    required
                    onChange={(e) => setFormData({ ...formData, civilStatus: e.target.value })}
                />
 <TextInput
                    type="text"
                    placeholder="Branch"
                    required
                    onChange={(e) => setFormData({ ...formData, civilStatus: e.target.value })}
                />

                <label>Date of Birth</label>
                <TextInput
                    type="date"
                    placeholder="date of birth"
                    required
                    onChange={(e) => setFormData({ ...formData, dateofbirth: e.target.value })}
                />
 <label>Date of Joined</label>
                <TextInput
                    type="date"
                    placeholder="Date of Join"
                    required
                    onChange={(e) => setFormData({ ...formData, DateofJoin: e.target.value })}
                />
                


<label>CDC Account </label>
             <Select onChange={(e) => setFormData({ ...formData, CDSDetails: e.target.value })} >
    
            <option value='yes'>yes</option>
            <option value='no'>no</option>

          </Select>
                {/* Qualifications */}
                <h2>Academic/Professional Qualifications</h2>
                {formData.academicQualifications.map((academicQualifications, index) => (
                    <div key={index} className="flex gap-4">
                        <TextInput
                            type="text"
                            placeholder="Qualification"
                            required
                            onChange={(e) => {
                                const academicQualifications = [...formData.academicQualifications];
                                academicQualifications[index].qualification = e.target.value;
                                setFormData({ ...formData, academicQualifications });
                            }}
                        />
                        <TextInput
                            type="text"
                            placeholder="Institute"
                            required
                            onChange={(e) => {
                                const academicQualifications = [...formData.academicQualifications];
                                academicQualifications[index].universityInstitute = e.target.value;
                                setFormData({ ...formData, academicQualifications });
                            }}
                        />
                        <TextInput
                            type="text"
                            placeholder="Status"
                            required
                            onChange={(e) => {
                                const academicQualifications = [...formData.academicQualifications];
                                academicQualifications[index].status = e.target.value;
                                setFormData({ ...formData, academicQualifications });
                            }}
                        />
                    </div>
                ))}
                <Button onClick={handleAddQualification} type="button" className="bg-black text-white">
                    Add Qualification
                </Button>    
                    <h2>previousEmploymentDetails</h2>
                {formData.previousEmploymentDetails.map((previousEmploymentDetails, index) => (
                    <div key={index} className="flex gap-4">
                        <TextInput
                            type="text"
                            placeholder="employer"
                            required
                            onChange={(e) => {
                                const previousEmploymentDetails = [...formData.previousEmploymentDetails];
                                previousEmploymentDetails[index].employer = e.target.value;
                                setFormData({ ...formData, previousEmploymentDetails });
                            }}
                        />
                        <TextInput
                            type="text"
                            placeholder="Natureofbusiness"
                            required
                            onChange={(e) => {
                                const previousEmploymentDetails = [...formData.previousEmploymentDetails];
                                previousEmploymentDetails[index].Natureofbusiness = e.target.value;
                                setFormData({ ...formData, previousEmploymentDetails });
                            }}
                        />
                        <TextInput
                            type="text"
                            placeholder="Positionheld"
                            required
                            onChange={(e) => {
                                const previousEmploymentDetails = [...formData.previousEmploymentDetails];
                                previousEmploymentDetails[index].Positionheld = e.target.value;
                                setFormData({ ...formData, previousEmploymentDetails });
                            }}
                        />

                                   <TextInput 
                            type="text"
                            placeholder="Lengthofservice"
                            required
                            onChange={(e) => {
                                const previousEmploymentDetails = [...formData.previousEmploymentDetails];
                                previousEmploymentDetails[index].Lengthofservice = e.target.value;
                                setFormData({ ...formData, previousEmploymentDetails });
                            }}
                        />
                    </div>
                ))}
  <Button onClick={handleAddEmployment} type="button" className="bg-black text-white">
                    Add Employement
                </Button> 
 
                             <h2>spouseDetails</h2>
                {formData.spouseDetails.map((spouseDetails, index) => (
                    <div key={index} className="flex gap-4">
                        <TextInput
                            type="text"
                            placeholder="name"
                            required
                            onChange={(e) => {
                                const spouseDetails = [...formData.spouseDetails];
                                spouseDetails[index].name = e.target.value;
                                setFormData({ ...formData, spouseDetails });
                            }}
                        />
                        <TextInput
                            type="text"
                            placeholder="ID"
                            required
                            onChange={(e) => {
                                const spouseDetails = [...formData.spouseDetails];
                                spouseDetails[index].ID = e.target.value;
                                setFormData({ ...formData, spouseDetails });
                            }}
                        />
                        <TextInput
                            type="text"
                            placeholder="placeOfWork"
                            required
                            onChange={(e) => {
                                const spouseDetails = [...formData.spouseDetails];
                                spouseDetails[index].placeOfWork = e.target.value;
                                setFormData({ ...formData, spouseDetails });
                            }}
                        />

                                   <TextInput 
                            type="text"
                            placeholder="positionHeld"
                            required
                            onChange={(e) => {
                                const spouseDetails = [...formData.spouseDetails];
                                spouseDetails[index].positionHeld = e.target.value;
                                setFormData({ ...formData, spouseDetails });
                            }}
                        />
                    </div>
                ))}
   <Button onClick={handleAddSpouseDetails} type="button" className="bg-black text-white">
                    Add SpouseDetails
                </Button> 
                      
 <h2>emergencyContact</h2>
                {formData.emergencyContact.map((emergencyContact, index) => (
                    <div key={index} className="flex gap-4">
                        <TextInput
                            type="text"
                            placeholder="name"
                            required
                            onChange={(e) => {
                                const emergencyContact = [...formData.emergencyContact];
                                emergencyContact[index].name = e.target.value;
                                setFormData({ ...formData, emergencyContact });
                            }}
                        />
                        <TextInput
                            type="text"
                            placeholder="relationship"
                            required
                            onChange={(e) => {
                                const emergencyContact = [...formData.emergencyContact];
                                emergencyContact[index].relationship = e.target.value;
                                setFormData({ ...formData, emergencyContact });
                            }}
                        />
                        <TextInput
                            type="text"
                            placeholder="contactNo"
                            required
                            onChange={(e) => {
                                const emergencyContact = [...formData.emergencyContact];
                                emergencyContact[index].contactNo = e.target.value;
                                setFormData({ ...formData, emergencyContact });
                            }}
                        />

                    </div>
                ))}
 


 <Button onClick={handleAddemergencyContact} type="button" className="bg-black text-white">
                    Add emergencyContact
                </Button> 
                

                {/* Other Fields */}
                {/* Add similar sections for previous employment, spouse details, and emergency contact details */}

                {/* File Upload */}
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
       

                <Button type="submit" className="bg-black text-white">
                    Submit
                </Button>
                {publishError && <Alert color="failure">{publishError}</Alert>}
            </form>
        </div>
    );
}
