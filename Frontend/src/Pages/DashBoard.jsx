import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSideBar from "../Components/DashSideBar";
import DashProfile from "../Components/DashProfile";
import DashUsers from "../Components/DashUsers";
import Dashstaff from "../Components/Dashstaff";
import AdminDashboard from "../Components/dashuserdetails";
import SendMail from "./sendMail";
import { useNavigate,useParams } from "react-router-dom";



export default function DashBoard() {
  const location = useLocation();
  const[tab,setTab]= useState();
  const[id,setid]= useState();
  const[email,setemail]=useState();

 

  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    const idfromurl = urlParams.get('id');
    const email=urlParams.get('email')
 
    if(tabFromUrl){
      setTab(tabFromUrl)
    }
    if(tabFromUrl){
      setid(idfromurl)
    }
    if(tabFromUrl){
      setemail(email)
    }
  },[location.search]);
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        <DashSideBar/>
      </div>
      {tab==='profile' && <DashProfile/>}
      {tab === 'users' && <DashUsers/>}
      {tab === 'staff' && <Dashstaff/>}
      {tab === 'view'&& id && <AdminDashboard id={id} />}
      {tab === 'sendemail'&& email && <SendMail email={email} />}
    

     

      {/*
      {tab == 'orders' && <DashOrders/>}
      {tab === 'myorders' && <DashMyOrders/>}

       */}

   
     
    </div>
  )
}
