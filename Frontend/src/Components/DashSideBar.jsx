import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiArchive, HiArrowSmRight, HiOutlineUserGroup, HiUser,HiGift, HiHome, HiOutlineHome, HiChartSquareBar, HiOutlineBookmarkAlt, HiDesktopComputer, HiTicket, HiSpeakerphone, HiSupport} from 'react-icons/hi';
import {
  HiBookmark,
  HiOutlineArchive,
} from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { signOut } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

export default function DashSideBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();
  const [tab, setTab] = useState();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleSignOut = async () => {
    try {
      await fetch("/api/user/signout");
      dispatch(signOut());
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Link to="/dashboard?tab=profile" key="profile">
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={currentUser?.isAdmin ? "Admin" : "User"}
              labelColor="dark"
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>

          {currentUser?.isAdmin && (
            <>
              <Link to="/dashboard?tab=users" key="users">
                <Sidebar.Item
                  active={tab === "users"}
                  icon={HiOutlineUserGroup}
                  as="div"
                >
                  Users
                </Sidebar.Item>
              </Link>
              <Link to='/dashboard?tab=staff' key="staff">
                <Sidebar.Item
                  active={tab === 'staff'}
                  icon={HiOutlineUserGroup}
                  as='div'
                >
                  Staff
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=requests" key="requests">
                <Sidebar.Item
                  active={tab === "requests"}
                  icon={HiBookmark}
                  labelColor="dark"
                  as="div"
                >
                  Requests
                </Sidebar.Item>
              </Link>

              <Link to="/dashboard?tab=products" key="products">
                <Sidebar.Item
                  active={tab === "products"}
                  icon={HiGift}
                  as="div"
                >
                  Products
                </Sidebar.Item>
              </Link>

              <Link to='/dashboard?tab=rooms' key="rooms">
                <Sidebar.Item
                  active={tab === 'rooms'}
                  icon={HiOutlineHome}
                  as='div'
                >
                  Rooms
                </Sidebar.Item>
              </Link>

              <Link to="/dashboard?tab=bookings" key="bookings">
                <Sidebar.Item
                  active={tab === "bookings"}
                  icon={HiOutlineBookmarkAlt}
                  as="div"
                  
                >
                  Booking Requests
                </Sidebar.Item>
              </Link>
             
              <Link to="/dashboard?tab=recived_orders" key="orders_recived">
                <Sidebar.Item
                  active={tab === "recived_orders"}
                  icon={HiArchive}
                  as="div"
                >
                  Recieved Orders
                </Sidebar.Item>
              </Link>



              <Link to="/dashboard?tab=support-desk" key="support-desk">
                <Sidebar.Item
                  active={tab === "support-desk"}
                  icon={HiDesktopComputer}
                  as="div"
                >
                  Support Desk
                </Sidebar.Item>
              </Link>

              <Link to="/dashboard?tab=announcement" key="announcement">
                <Sidebar.Item
                  active={tab === "announcement"}
                  icon={HiSpeakerphone}
                  as="div"
                >
                  Announcements
                </Sidebar.Item>
              </Link>

              <Link to="/dashboard?tab=suppliers" key="suppliers">
                <Sidebar.Item
                  active={tab === "suppliers"}
                  icon={HiSupport}
                  as="div"
                >
                 Suppliers
                </Sidebar.Item>
              </Link>
{/* 
              <Link to="/dashboard?tab=pending_suppliers" key="pending_suppliers">
                <Sidebar.Item
                  active={tab === "pending_suppliers"}
                  icon={HiSupport}
                  as="div"
                >
                 Pending Suppliers
                </Sidebar.Item>
              </Link> */}
            </>
          )}

          <Link to="/dashboard?tab=my_requests" key="myrequests">
            <Sidebar.Item
              active={tab === "my_requests"}
              icon={HiBookmark}
              labelColor="dark"
              as="div"
            >
              My Requests
            </Sidebar.Item>
          </Link>

          <Link to="/dashboard?tab=mybookings" key="mybookings">
            <Sidebar.Item
              active={tab === "my_requests"}
              icon={HiOutlineBookmarkAlt}
              labelColor="dark"
              as="div"
            >
              My Bookings
            </Sidebar.Item>
          </Link>
          

          <Link to="/dashboard?tab=my_orders" key="orders">
            <Sidebar.Item
              active={tab === "my_orders"}
              icon={HiOutlineArchive}
              as="div"
            >
              My Orders
            </Sidebar.Item>
          </Link>

          <Link to="/dashboard?tab=my_tickets" key="tickets">
            <Sidebar.Item
              active={tab === "my_tickets"}
              icon={HiTicket}
              as="div"
            >
              My Tickets
            </Sidebar.Item>
          </Link>
          
<hr />
          <Sidebar.Item
            icon={HiArrowSmRight}
            className="cursor-pointer"
            onClick={handleSignOut}
            key="signout"
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
