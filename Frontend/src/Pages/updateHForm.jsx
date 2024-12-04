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
          setFormData({ ...formData, userId: id });
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchs();
  }, [fid]);

  const handleArrayChange = (setter, index, value) => {
    setter((prev) =>
      prev.map((item, i) => (i === index ? value : item))
    );
  };

  const handleAddArrayItem = (setter, placeholder = "") => {
    setter((prev) => [...prev, placeholder]);
  };

  const handleRemoveArrayItem = (setter, index) => {
    setter((prev) => prev.filter((_, i) => i !== index));
  };

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
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      if (res.ok) {
        setPublishError(null);
        alert("Updated");
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
          id="Member Name"
          className="flex-1"
          onChange={(e) => setFullname(e.target.value)}
          defaultValue={fullname}
        />
        <TextInput
          type="text"
          placeholder="Address"
          required
          id="Address"
          className="flex-1"
          onChange={(e) => setAddress(e.target.value)}
          defaultValue={address}
        />
        <TextInput
          type="text"
          placeholder="Phone Number"
          required
          id="Phone number"
          className="flex-1"
          onChange={(e) => setContactno(e.target.value)}
          defaultValue={contactno}
        />
        <TextInput
          type="text"
          placeholder="NIC Number"
          required
          id="NIC"
          className="flex-1"
          onChange={(e) => setNIC(e.target.value)}
          defaultValue={NIC}
        />
        <label>Date of Birth</label>
        <TextInput
          type="date"
          required
          id="Date of Birth"
          className="flex-1"
          onChange={(e) => setDateofbirth(e.target.value)}
          defaultValue={dateofbirth}
        />
        <label>Date of Join</label>
        <TextInput
          type="date"
          required
          id="Date of Join"
          className="flex-1"
          onChange={(e) => setDateofJoin(e.target.value)}
          defaultValue={DateofJoin}
        />
        <label>CDC Account</label>
        <Select
          onChange={(e) => setCDSDetails(e.target.value)}
          defaultValue={CDSDetails}
        >
          <option value="yes">yes</option>
          <option value="no">no</option>
        </Select>

        {/* Array fields */}
        {[
          {
            label: "Academic Qualifications",
            array: academicQualifications,
            setter: setAcademicQualifications,
          },
          {
            label: "Previous Employment Details",
            array: previousEmploymentDetails,
            setter: setPreviousEmploymentDetails,
          },
          {
            label: "Spouse Details",
            array: spouseDetails,
            setter: setSpouseDetails,
          },
          {
            label: "Emergency Contacts",
            array: emergencyContact,
            setter: setEmergencyContact,
          },
        ].map(({ label, array, setter }, index) => (
          <div key={index}>
            <label>{label}</label>
            {array.map((item, i) => (
              <div key={i} className="flex gap-2 items-center">
                <TextInput
                  type="text"
                  value={item}
                  onChange={(e) => handleArrayChange(setter, i, e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  color="failure"
                  onClick={() => handleRemoveArrayItem(setter, i)}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              type="button"
              gradientDuoTone="greenToBlue"
              onClick={() => handleAddArrayItem(setter)}
            >
              Add {label.slice(0, -1)}
            </Button>
          </div>
        ))}

        <Button type="submit" gradientDuoTone="purpleToBlue">
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
