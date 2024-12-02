import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { useState } from "react";
import 'react-quill/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from "../firebase";
import { CircularProgressbar } from 'react-circular-progressbar';
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateStaff() {
    const [formData, setFormData] = useState({
        qualifications: [],
        previousEmployment: [],
        spouseDetails: [],
        emergencyContact: {}
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
            qualifications: [...formData.qualifications, { qualification: "", institute: "", status: "" }]
        });
    };

    const handleAddEmployment = () => {
        setFormData({
            ...formData,
            previousEmployment: [...formData.previousEmployment, { employer: "", position: "" }]
        });
    };

    const handleAddSpouseDetails = () => {
        setFormData({
            ...formData,
            spouseDetails: [...formData.spouseDetails, { name: "", id: "", workPlace: "", position: "" }]
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
            document1: fileURL
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
                


                {/* Qualifications */}
                <h2>Academic/Professional Qualifications</h2>
                {formData.qualifications.map((qualification, index) => (
                    <div key={index} className="flex gap-4">
                        <TextInput
                            type="text"
                            placeholder="Qualification"
                            required
                            onChange={(e) => {
                                const qualifications = [...formData.qualifications];
                                qualifications[index].qualification = e.target.value;
                                setFormData({ ...formData, qualifications });
                            }}
                        />
                        <TextInput
                            type="text"
                            placeholder="Institute"
                            required
                            onChange={(e) => {
                                const qualifications = [...formData.qualifications];
                                qualifications[index].institute = e.target.value;
                                setFormData({ ...formData, qualifications });
                            }}
                        />
                        <TextInput
                            type="text"
                            placeholder="Status"
                            required
                            onChange={(e) => {
                                const qualifications = [...formData.qualifications];
                                qualifications[index].status = e.target.value;
                                setFormData({ ...formData, qualifications });
                            }}
                        />
                    </div>
                ))}
                <Button onClick={handleAddQualification} type="button" gradientDuoTone="purpleToBlue">
                    Add Qualification
                </Button>

                {/* Other Fields */}
                {/* Add similar sections for previous employment, spouse details, and emergency contact details */}

                {/* File Upload */}
                <FileInput
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                />
                <Button onClick={handleUploadImage} type="button" gradientDuoTone="purpleToBlue">
                    Upload File
                </Button>

                <Button type="submit" gradientDuoTone="purpleToBlue">
                    Submit
                </Button>
                {publishError && <Alert color="failure">{publishError}</Alert>}
            </form>
        </div>
    );
}
