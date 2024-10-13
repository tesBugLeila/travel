
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import AllTravels from './components/Travels/AllTravels';
import MyTravels from './components/Travels/MyTravels';
import CreateTravel from './components/Travels/CreateTravel';
import TravelDetails from './components/Travels/TravelDetails';
import ProtectedRoute from './components/ProtectedRoute';
import AuthProvider from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          
        
          <Route path="/travels/mine" element={
            <ProtectedRoute>
              <MyTravels />
            </ProtectedRoute>
          } />
          <Route path="/travels" element={
            <ProtectedRoute>
              <AllTravels />
            </ProtectedRoute>
          } />
          <Route path="/travels/new" element={
            <ProtectedRoute>
              <CreateTravel />
            </ProtectedRoute>
          } />
          <Route path="/travels/:id" element={
            <ProtectedRoute>
              <TravelDetails />
            </ProtectedRoute>
          } />
          
         
          <Route path="/" element={
            <ProtectedRoute>
              <AllTravels />
            </ProtectedRoute>
          } />
          
         
          <Route path="*" element={<Login />} />
        </Routes>
        <ToastContainer />
      </Router>
    </AuthProvider>
  );
};

export default App;
