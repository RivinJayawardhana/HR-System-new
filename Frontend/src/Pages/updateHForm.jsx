import { Alert, Button, Select, TextInput } from "flowbite-react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateHform() {
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [fid, setfid] = useState(null);
  const [fullname, setFullname] = useState("");
  const [address, setAddress] = useState("");
  const [contactno, setContactno] = useState("");
  const [dateofbirth, setDateofbirth] = useState("");
  const [NIC, setNIC] = useState("");
  const [DateofJoin, setDateofJoin] = useState("");
  const [CDSDetails, setCDSDetails] = useState("");
  const [status, setStatus] = useState("");
  const [civilstatus, setcivilstatus] = useState("");
  const [academicQualifications, setAcademicQualifications] = useState([]);
  const [previousEmploymentDetails, setPreviousEmploymentDetails] = useState([]);
  const [spouseDetails, setSpouseDetails] = useState([]);
  const [emergencyContact, setEmergencyContact] = useState([]);

  // Fetch form data on component mount
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
          setStatus(data.status);
          setcivilstatus(data.civilStatus);
          setAcademicQualifications(data.academicQualifications || []);
          setPreviousEmploymentDetails(data.previousEmploymentDetails || []);
          setSpouseDetails(data.spouseDetails || []);
          setEmergencyContact(data.emergencyContact || []);
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchs();
  }, [id]);

  // Array item handlers
  const handleArrayObjectChange = (setter, index, field, value) => {
    setter((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleAddArrayObjectItem = (setter, defaultObject) => {
    setter((prev) => [...prev, defaultObject]);
  };

  const handleRemoveArrayObjectItem = (setter, index) => {
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedFormData = {
        fullname,
        address,
        contactno,
        dateofbirth,
        NIC,
        DateofJoin,
        CDSDetails,
        status,
        civilStatus: civilstatus,
        academicQualifications,
        previousEmploymentDetails,
        spouseDetails,
        emergencyContact,
      };

      const res = await fetch(`/api/form/update/${fid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFormData),
      });

      if (!res.ok) {
        const data = await res.json();
        setPublishError(data.message);
        return;
      }
      setPublishError(null);
      alert("Updated successfully!");
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
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
        />
        <TextInput
          type="text"
          placeholder="Address"
          required
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <TextInput
          type="text"
          placeholder="Phone Number"
          required
          value={contactno}
          onChange={(e) => setContactno(e.target.value)}
        />
        <TextInput
          type="text"
          placeholder="NIC Number"
          required
          value={NIC}
          onChange={(e) => setNIC(e.target.value)}
        />
        <label>Date of Birth</label>
        <TextInput
          type="date"
          required
          value={dateofbirth}
          onChange={(e) => setDateofbirth(e.target.value)}
        />
        <label>Date of Join</label>
        <TextInput
          type="date"
          required
          value={DateofJoin}
          onChange={(e) => setDateofJoin(e.target.value)}
        />
        <label>CDC Account</label>
        <Select value={CDSDetails} onChange={(e) => setCDSDetails(e.target.value)}>
          <option value="yes">yes</option>
          <option value="no">no</option>
        </Select>

        {/* Dynamic Array Fields */}
        {[
          {
            label: "Academic Qualifications",
            array: academicQualifications,
            setter: setAcademicQualifications,
            defaultObject: { qualification: "", universityInstitute: "",status:"" },
          },
          {
            label: "Previous Employment Details",
            array: previousEmploymentDetails,
            setter: setPreviousEmploymentDetails,
            defaultObject: { employer: "", Natureofbusiness: "", Positionheld: "",Lengthofservice:"" },
          },
          {
            label: "Spouse Details",
            array: spouseDetails,
            setter: setSpouseDetails,
            defaultObject: { name: "", ID: "",placeOfWork:"",positionHeld:""},
          },
          {
            label: "Emergency Contacts",
            array: emergencyContact,
            setter: setEmergencyContact,
            defaultObject: { name: "", relationship: "",contactNo:""},
          },
        ].map(({ label, array, setter, defaultObject }, index) => (
          <div key={index}>
            <label>{label}</label>
            {array.map((item, i) => (
              <div key={i} className="flex flex-col gap-2">
                {Object.keys(defaultObject).map((field) => (
                  <TextInput
                    key={field}
                    type="text"
                    placeholder={field}
                    value={item[field] || ""}
                    onChange={(e) =>
                      handleArrayObjectChange(setter, i, field, e.target.value)
                    }
                  />
                ))}
                <Button
                  type="button"
                  color="failure"
                  onClick={() => handleRemoveArrayObjectItem(setter, i)}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              type="button"
              className="bg-black text-white"
              onClick={() => handleAddArrayObjectItem(setter, defaultObject)}
            >
              Add {label}
            </Button>
          </div>
        ))}

        <Button type="submit"className="bg-black text-white">
          Update
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
