import React, { useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import SettingTabs from '../../components/SettingTabs';
import { useNavigate } from 'react-router-dom';

const BookingSettings: React.FC = () => {
      const navigate = useNavigate();
      useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/auth/signin');
        }
      }, []);
  return (
    <>
      <Breadcrumb pageName="Booking Settings" />
      <SettingTabs  />
    </>
  );
};

export default BookingSettings;
