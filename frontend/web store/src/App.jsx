import {Navigate,Route,Routes} from "react-router-dom";
import Homepage from "./pages/homepage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import CategoryPage from "./pages/CategoryPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import LoadingSpinner from "./Components/loadingspinnder.jsx";
import Navbar from "./Components/navbar.jsx";
import './index.css';
import { Toaster } from "react-hot-toast";
import useUserStore from "./stores/UseUserStore.js";
import useCartStore from "./stores/UseCartStore.js";
import { useEffect } from "react";

function App() {
const {user,checkAuth,checkingauth} = useUserStore();
const {getCartItems} = useCartStore();
useEffect(()=>{checkAuth()},[checkAuth]);
useEffect(()=>{getCartItems()},[getCartItems]);

if(checkingauth){return <LoadingSpinner />}

  return (
    
    <div className='min-h-screen bg-gray-900 text-white relative overflow-hidden'>
    <div className='absolute inset-0 overflow-hidden'>
      <div className='absolute inset-0'>
        
        <div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(147,112,219,0.4)_0%,rgba(102,51,153,0.3)_45%,rgba(0,0,0,0.1)_100%)]' /> 
      
      </div>
    </div>
    <div className='relative z-50 pt-20'>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/signup" element={!user ? <SignupPage /> : <Navigate to='/' />}/>
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to='/' />} />
        <Route path="/secret-dashboard" element={user?.role==='admin' ? <AdminPage /> : <Navigate to='/login'/>} />
        <Route path="/category/:category" element={<CategoryPage/>} />
        <Route path="/cart" element={user ? <CartPage/> : <Navigate to='/login'/>} />

      </Routes>
      </div>
      <Toaster/>
    </div>
  )
}

export default App;
