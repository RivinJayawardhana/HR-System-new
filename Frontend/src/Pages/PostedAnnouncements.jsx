import React, { useEffect, useState } from 'react';
import { Button, Card, Modal } from 'flowbite-react';

export default function PostedAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null); // For storing the clicked announcement
  const [isOpen, setIsOpen] = useState(false); // Modal open/close state

  // Fetch all announcements on component mount
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await fetch('/api/announcement/get_all_announcements');
        const data = await res.json();
        if (res.ok) {
          setAnnouncements(data); // Store announcements in state
        } else {
          console.error('Failed to fetch announcements:', data.message);
        }
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    };

    fetchAnnouncements();
  }, []);

  // Handle click on the "Read more" button to show the modal
  const handleReadMore = (announcement) => {
    setSelectedAnnouncement(announcement); // Set the selected announcement
    setIsOpen(true); // Open the modal
  };

  // Close the modal
  const handleClose = () => {
    setIsOpen(false); // Close the modal
    setSelectedAnnouncement(null); // Clear the selected announcement
  };

  return (
    <div className="p-10">
      <h1 className="text-xl font-sans mt-3 pb-10 font-semibold">
        Announcements by management
      </h1>
      <div className="max-auto items-center">
        {announcements.length > 0 ? (
          announcements.map((announcement) => (
            <Card className="w-9/12 shadow mb-6" key={announcement._id}>
              <h5 className="text-lg font-bold tracking-tight text-purple-900 dark:text-white">
                Title: {announcement.title}
              </h5>
              <p className="font-sm text-gray-700 dark:text-gray-400">
                Category: {announcement.category}
              </p>
              <p className="font-sm text-gray-700 dark:text-gray-400">
                Description: {announcement.description.slice(0, 100)}...
              </p>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                Date: {new Date(announcement.createdAt).toLocaleDateString()}
              </p>
              <Button
                className="bg-purple-700 hover:bg-purple-800"
                onClick={() => handleReadMore(announcement)}
              >
                Read more
              </Button>
            </Card>
          ))
        ) : (
          <p>No announcements available</p>
        )}
      </div>

      {/* Modal to display full description */}
      {selectedAnnouncement && (
        <Modal show={isOpen} onClose={handleClose}>
          <Modal.Header>
            {selectedAnnouncement.title}
          </Modal.Header>
          <Modal.Body>
            <div className="space-y-4">
              <p className="font-semibold">Category: {selectedAnnouncement.category}</p>
              <p>{selectedAnnouncement.description}</p>
              <p className="text-sm text-gray-600">
                Posted on: {new Date(selectedAnnouncement.createdAt).toLocaleDateString()}
              </p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button className="bg-purple-700 hover:bg-purple-800" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}
