import React, { useEffect, useState } from "react";
import { Alert, Button, Select, Textarea, TextInput } from "flowbite-react";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateSellerRequest() {
  const [formData, setFormData] = useState({
    supplierName: "",
    supplierRegisterNo: "",
    dateOfRegistration: "",
    businessAddress: "",
    contactNumber: "",
    email: "",
    productCategories: [],
    isSupplier: false,  // Default to false
  });
  const [publishError, setPublishError] = useState(null);
  const [emailSent, setEmailSent] = useState(false); // New state for email status
  const { id } = useParams(); // Get the ID from the URL params
  const navigate = useNavigate();

  // Fetch relevant supplier using id
  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const res = await fetch(`/api/supplier/get_a_supplier/${id}`); // Fetching the supplier by ID
        const data = await res.json();
        if (!res.ok) {
          console.error(res);
        } else {
          setFormData(data); // Pre-populate the form with supplier data
        }
      } catch (error) {
        console.error("Error fetching the supplier:", error);
      }
    };

    fetchSupplier();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Only allow changes to isSupplier field
    if (name === "isSupplier") {
      setFormData({ ...formData, [name]: value === "true" }); // Convert string to boolean for isSupplier
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send only the `isSupplier` field to the backend
      const res = await fetch(`/api/supplier/update_supplier/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isSupplier: formData.isSupplier }), // Send only the `isSupplier` field
      });

      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      setPublishError(null);
      if (formData.isSupplier) {
        setEmailSent(true); // Set email sent flag when supplier is approved
      } else {
        setEmailSent(false);
      }

      alert("Supplier status updated successfully!");
      navigate("/dashboard?tab=suppliers"); // Navigate back to suppliers page
    } catch (error) {
      console.error(error);
      setPublishError("Something went wrong");
    }
  };

  return (
    <div className="p-3 mx-auto">
      <h1 className="text-center text-3xl my-7 font-semibold">Update Supplier</h1>
      <form className="flex max-w-3xl flex-col mx-auto pb-10" onSubmit={handleSubmit}>
        <div className="flex flex-col justify-center">
          {/* Supplier Name (Read-only) */}
          <label className="font-semibold">Supplier Name</label>
          <TextInput
            type="text"
            id="supplierName"
            name="supplierName"
            className="p-2 mb-2"
            value={formData.supplierName}
            readOnly
          />

          {/* Supplier Register No (Read-only) */}
          <label className="font-semibold">Supplier Register No</label>
          <TextInput
            type="text"
            id="supplierRegisterNo"
            name="supplierRegisterNo"
            className="p-2 mb-2"
            value={formData.supplierRegisterNo}
            readOnly
          />

          {/* Date Of Registration (Read-only) */}
          <label className="font-semibold">Date Of Registration</label>
          <TextInput
            type="date"
            id="dateOfRegistration"
            name="dateOfRegistration"
            className="p-2 mb-2"
            value={formData.dateOfRegistration.split("T")[0]} // Format date for input field
            readOnly
          />

          {/* Business Address (Read-only) */}
          <label className="font-semibold">Business Address</label>
          <Textarea
            id="businessAddress"
            name="businessAddress"
            className="p-2 mb-2"
            value={formData.businessAddress}
            readOnly
          />

          {/* Contact Number (Read-only) */}
          <label className="font-semibold">Contact Number</label>
          <TextInput
            type="text"
            id="contactNumber"
            name="contactNumber"
            className="p-2 mb-2"
            value={formData.contactNumber}
            readOnly
          />

          {/* Email (Read-only) */}
          <label className="font-semibold">Email</label>
          <TextInput
            type="email"
            id="email"
            name="email"
            className="p-2 mb-2"
            value={formData.email}
            readOnly
          />

          {/* Product Categories (Read-only) */}
          <label className="font-semibold">Product Categories</label>
          <TextInput
            type="text"
            id="productCategories"
            name="productCategories"
            className="p-2 mb-2"
            value={formData.productCategories.join(", ")} // Join categories with commas
            readOnly
          />

          {/* Supplier Approval Status (isSupplier) */}
          <label className="font-semibold">Supplier Approval Status</label>
          <Select
            id="isSupplier"
            name="isSupplier"
            className="p-2 mb-2"
            value={formData.isSupplier ? "true" : "false"}
            onChange={handleChange}
          >
            <option value="" disabled>Select One</option>
            <option value="true">Approved</option>
            <option value="false">Rejected</option>
          </Select>
        </div>

        <Button type="submit" className="bg-purple-700 hover:bg-purple-800 p-2 rounded-lg text-white">
          Update Supplier
        </Button>

        {publishError && (
          <Alert className="mt-5" color="failure">
            {publishError}
          </Alert>
        )}

        {/* Display this alert if an email is sent */}
        {emailSent && (
          <Alert className="mt-5" color="success">
            Approval email sent to the supplier.
          </Alert>
        )}
      </form>
    </div>
  );
}
