import { Button, Modal, Table, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiOutlineArchive, HiOutlineExclamationCircle } from "react-icons/hi";
import { Link } from "react-router-dom";

export default function DashSupplierRegistration() {
  const [suppliers, setSuppliers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModel, setShowModel] = useState(false);
  const [supplierIdToDelete, setSupplierIdToDelete] = useState("");
  const [totalSuppliers, setTotalSuppliers] = useState(0);
  const [searchName, setSearchName] = useState("");

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await fetch(`/api/supplier/get_all_suppliers`);
        const data = await res.json();
        const supplier = data.filter(
          (supplier) => supplier.isSupplier === false
        );
        setTotalSuppliers(supplier.length);

        if (res.ok) {
          setSuppliers(supplier);
          if (supplier.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log("Error fetching suppliers", error);
      }
    };

    fetchSuppliers();
  }, []);

  // delete supplier by id
  const handleDeleteSupplier = async () => {
    setShowModel(false);
    try {
      const res = await fetch(
        `/api/supplier/delete_supplier/${supplierIdToDelete}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setSuppliers((prev) =>
          prev.filter((supplier) => supplier._id !== supplierIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      <div className="flex flex-wrap gap-5">
        

        <div className="flex-wrap flex gap-4 justify-center">
          <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
            <div className="flex justify-between">
              <div className="">
                <h3 className="text-gray-500 text-md uppercase">
                  Total Suppliers Registrations
                </h3>
                <p className="text-2xl">{totalSuppliers}</p>
              </div>

              <HiOutlineArchive className="bg-green-600 text-white rounded-full text-5xl p-3 shadow-lg" />
            </div>
            <div className="flex gap-2 text-sm">
              <span className="text-green-500 flex items-center">
                <HiOutlineArchive />
                {totalSuppliers}
              </span>
              <div className="text-gray-500">Total</div>
            </div>
          </div>
        </div>
      </div>
      <h1 className="pt-6 px-4 font-semibold">Become Suppliers Requests</h1>

      {Array.isArray(suppliers) && suppliers.length > 0 ? (
        <>
          <div className="flex ">
            <TextInput
              type="text"
              placeholder="Search a supplier by (Name or Email)"
              required
              id="search"
              className="flex-1"
              style={{
                width: 700,
                marginTop: 30,
                marginBottom: 30,
                marginLeft: 250,
              }}
              onChange={(e) => setSearchName(e.target.value)}
            />
          </div>
          <div className="flex gap-5"></div>
          <Link to="/dashboard?tab=suppliers">
            <Button gradientDuoTone="purpleToBlue" outline className="">
              Go to suppliers
            </Button>
          </Link>{" "}
          <br />
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Supplier Name</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Contact Number</Table.HeadCell>
              <Table.HeadCell>Business Address</Table.HeadCell>
              <Table.HeadCell>Product Categories</Table.HeadCell>
              <Table.HeadCell>Actions</Table.HeadCell>
            </Table.Head>

            {suppliers
              .filter((item) => {
                const searchQuery = searchName.toLowerCase();
                const nameMatch = item.supplierName
                  ? item.supplierName.toLowerCase().includes(searchQuery)
                  : false;
                const emailMatch = item.email
                  ? item.email.toLowerCase().includes(searchQuery)
                  : false;

                // Return true if either name or email matches
                return nameMatch || emailMatch;
              })
              .map((item) => (
                <Table.Body className="divide-y" key={item._id}>
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>{item.supplierName}</Table.Cell>
                    <Table.Cell>{item.email}</Table.Cell>
                    <Table.Cell>{item.contactNumber}</Table.Cell>
                    <Table.Cell>{item.businessAddress}</Table.Cell>
                    <Table.Cell>{item.productCategories.join(", ")}</Table.Cell>
                    <Table.Cell>
                      <div className="flex flex-row gap-2">
                        <Link to={`/update-pending-supplier/${item._id}`}>
                          <button>
                            <box-icon name="edit-alt" color="green"></box-icon>
                          </button>
                        </Link>

                        <Link to={`/contact-supplier/${item._id}`}>
                          <button>
                            <box-icon
                              type="solid"
                              name="phone-call"
                              color="darkBlue"
                            ></box-icon>
                          </button>
                        </Link>

                        <button
                          onClick={() => {
                            setShowModel(true);
                            setSupplierIdToDelete(item._id);
                          }}
                        >
                          <box-icon
                            type="solid"
                            name="message-square-x"
                            color="red"
                          ></box-icon>
                        </button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
          {showMore && (
            <button className="w-full text-teal-500 self-center text-sm py-7">
              Show more
            </button>
          )}
        </>
      ) : (
        <p>No suppliers found</p>
      )}

      <Modal
        show={showModel}
        onClose={() => setShowModel(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-200">
              Are you sure you want to delete this supplier?
            </h3>
          </div>
          <div className="flex justify-center gap-4">
            <Button color="failure" onClick={handleDeleteSupplier}>
              Yes, I am sure
            </Button>
            <Button color="gray" onClick={() => setShowModel(false)}>
              No, cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
