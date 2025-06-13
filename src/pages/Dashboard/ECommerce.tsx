import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import CardDataStats from '../../components/CardDataStats';
import ChartOne from '../../components/Charts/ChartOne';
import TableOne from '../../components/Tables/TableOne';
import { useNavigate } from 'react-router-dom';

type TotalBookingsResponse = { totalBookings: number };
type TotalPriceResponse = { totalPrice: number };
type UniqueUsersResponse = { totalUsers: number };
type TotalCourtsResponse = { totalCourts: number };

const fetchTotalBookings = async (): Promise<TotalBookingsResponse> => {
  const res = await fetch('http://localhost:5000/api/summary/total-bookings');
  if (!res.ok) throw new Error('Failed to fetch total bookings.');
  return res.json();
};

const fetchTotalPrice = async (): Promise<TotalPriceResponse> => {
  const res = await fetch('http://localhost:5000/api/summary/total-price');
  if (!res.ok) throw new Error('Failed to fetch total price.');
  return res.json();
};

const fetchUniqueUsers = async (): Promise<UniqueUsersResponse> => {
  const res = await fetch('http://localhost:5000/api/summary/unique-users');
  if (!res.ok) throw new Error('Failed to fetch unique users.');
  return res.json();
};

const fetchTotalCourts = async (): Promise<TotalCourtsResponse> => {
  const res = await fetch('http://localhost:5000/api/summary/total-courts');
  if (!res.ok) throw new Error('Failed to fetch total courts.');
  return res.json();
};

const ECommerce: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/auth/signin');
    }
  }, []);
  const {
    data: bookingsData,
    isLoading: isLoadingBookings,
    isError: isErrorBookings,
    error: bookingsError,
  } = useQuery<TotalBookingsResponse, Error>({
    queryKey: ['totalBookings'],
    queryFn: fetchTotalBookings,
  });

  const {
    data: priceData,
    isLoading: isLoadingPrice,
    isError: isErrorPrice,
    error: priceError,
  } = useQuery<TotalPriceResponse, Error>({
    queryKey: ['totalPrice'],
    queryFn: fetchTotalPrice,
  });

  const {
    data: usersData,
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
    error: usersError,
  } = useQuery<UniqueUsersResponse, Error>({
    queryKey: ['uniqueUsers'],
    queryFn: fetchUniqueUsers,
  });

  const {
    data: courtsData,
    isLoading: isLoadingCourts,
    isError: isErrorCourts,
    error: courtsError,
  } = useQuery<TotalCourtsResponse, Error>({
    queryKey: ['totalCourts'],
    queryFn: fetchTotalCourts,
  });

  if (
    isLoadingBookings ||
    isLoadingPrice ||
    isLoadingUsers ||
    isLoadingCourts
  ) {
    return <div>Loading stats...</div>;
  }

  if (isErrorBookings || isErrorPrice || isErrorUsers || isErrorCourts) {
    return <div>Error loading stats.</div>;
  }

  // ----------------- Extract Values -----------------
  const totalBookings = bookingsData?.totalBookings ?? 0;
  const totalPrice = priceData?.totalPrice ?? 0;
  const totalUsers = usersData?.totalUsers ?? 0;
  const totalCourts = courtsData?.totalCourts ?? 0;

  return (
    <>
      <h2 className="text-title-md2 mb-5 font-semibold text-black dark:text-white">
        Dashboard
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {/* Card #1: Total Bookings */}
        <CardDataStats
          title="Total Bookings"
          total={String(totalBookings)}
          rate=""
        >
          {/* Example icon */}
          <svg
            className="fill-primary dark:fill-white"
            width="22"
            height="22"
            viewBox="0 0 24 24"
          >
            <path d="M5 3h14a2 2 0 0 1 2 2v2h-2V5H5v14h14v-2h2v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm4 4h6v2H9V7zm-2 4h10v2H7v-2z" />
          </svg>
        </CardDataStats>

        {/* Card #2: Total Price */}
        <CardDataStats
          title="Total Revenue"
          total={`PKR ${(totalPrice || 0).toLocaleString()}`}
          rate=""
        >
          {/* Example icon */}
          <svg
            className="fill-primary dark:fill-white"
            width="22"
            height="22"
            viewBox="0 0 24 24"
          >
            <path d="M11 2C6.58 2 3 5.58 3 10c0 3.53 2.61 6.77 6.05 7.58v1.42h2v-1.42c1.78-.34 3.34-1.25 4.45-2.58h2.79v-2h-2.08a7.977 7.977 0 0 0 .29-2c0-4.42-3.58-8-8-8zm3.99 8c0 .68-.13 1.34-.38 1.94l-1.55-.31c.16-.5.24-1.02.24-1.63H15zM6.31 8c.38-1.72 1.89-3 3.69-3 1.65 0 3.06 1.09 3.57 2.57l-1.55.31C11.84 7.22 11.43 7 11 7 9.9 7 9 7.9 9 9c0 .43.22.84.57 1.09l-1.55.31C7.4 10.06 7 9.65 7 9.2 7 8.75 7.23 8.38 7.57 8.15L6.31 8z" />
          </svg>
        </CardDataStats>

        {/* Card #3: Unique Users */}
        <CardDataStats title="Unique Users" total={String(totalUsers)} rate="">
          {/* Example icon */}
          <svg
            className="fill-primary dark:fill-white"
            width="22"
            height="22"
            viewBox="0 0 24 24"
          >
            <path d="M12 2c2.75 0 5 2.25 5 5s-2.25 5-5 5-5-2.25-5-5 2.25-5 5-5zm0 14c3.086 0 7 1.462 7 2.998V21H5v-2.002C5 17.462 8.914 16 12 16z" />
          </svg>
        </CardDataStats>

        {/* Card #4: Total Courts */}
        <CardDataStats title="Total Courts" total={String(totalCourts)} rate="">
          {/* Example icon */}
          <svg
            className="fill-primary dark:fill-white"
            width="22"
            height="22"
            viewBox="0 0 24 24"
          >
            <path d="M3 21V8l9-6 9 6v13h-7v-7H10v7H3zM9 10h6V6.699L12 4.8l-3 1.899V10z" />
          </svg>
        </CardDataStats>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-4 ">
        <div className="col-span-12 h-full md:col-span-6">
          <ChartOne />
        </div>
        <div className="col-span-12 h-full md:col-span-6">
          <TableOne />
        </div>
      </div>
    </>
  );
};

export default ECommerce;
