import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import SignIn from './Pages/SignIn';
import SignUp from './Pages/SignUp';
import Header from './Components/Header';
import DashBoard from './Pages/DashBoard';
import PrivateRoute from './Components/PrivateRoute';
import OnlyAdminPrivateRoute from './Components/OnlyAdminPrivateRoute';


import Addstaff from './Pages/Addstaff';
import Updatestaff from './Pages/updateStaff';
import FormsPage from './Pages/UserDashboard';



import UserSignIn from './Pages/userlogin';



export default function App() {
  return (
    <BrowserRouter>
     
      <Routes>
        <Route path="/" element={<SignIn />} />
       
        <Route path="/sign-up" element={<SignUp />} />
     
        <Route path='/userlogin' element={<UserSignIn/>}/>
        <Route path='/userdash' element={<FormsPage/>}/>

 
        <Route path="/addstaff" element={<Addstaff/>}/>
        <Route path="/updatestaff/:id" element={<Updatestaff/>}/>
 



        <Route element={<PrivateRoute />} />
        <Route path="/dashboard" element={<DashBoard />} />
         
       

        <Route element={<OnlyAdminPrivateRoute />}></Route>

      
      
      

      </Routes>

    </BrowserRouter>
  );
}
