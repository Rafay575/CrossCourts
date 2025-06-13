import React, { useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import SportsTabs from '../../components/SportsTabs';
import { useNavigate } from 'react-router-dom';
const BookingManagement: React.FC = () => {
      const navigate = useNavigate();
      useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/auth/signin');
        }
      }, []);
      
  return (
    <>
    <Breadcrumb pageName="Booking Management" />
     <SportsTabs /> 
   </>
  );
};

export default BookingManagement;
