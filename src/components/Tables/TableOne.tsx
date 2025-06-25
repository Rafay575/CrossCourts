import React from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { baseUrl } from "../../api/baseUrl";

// 1) Define a TypeScript type for your booking records.
type Booking = {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
  price: number;
  booking_date: string;
  // Add any other fields if needed (e.g., phone, court_id, etc.)
};

// 2) Fetch function that calls your API endpoint returning the last 10 bookings.
async function fetchLastTenBookings(): Promise<Booking[]> {
  const res = await fetch(`${baseUrl}/api/last-five-bookings`);
  if (!res.ok) {
    throw new Error("Failed to fetch last 10 bookings");
  }
  return res.json(); // Should be an array of Booking objects
}

const TableOne: React.FC = () => {
  // 3) Use React Query to fetch data, returning an array of Booking.
  const {
    data: bookings = [], // If data is undefined, default to []
    isLoading,
    isError,
    error,
  } = useQuery<Booking[], Error>({
    queryKey: ["lastTenBookings"],
    queryFn: fetchLastTenBookings,
  });

  // 4) Handle loading / error states
  if (isLoading) {
    return <div className="p-4 text-center">Loading last 10 bookings...</div>;
  }

  if (isError) {
    return (
      <div className="p-4 text-center text-red-500">
        Error: {error?.message}
      </div>
    );
  }

  // 5) Render the table once data is loaded
  return (
    <div className="rounded-sm h-full  border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
      <h4 className="mb-4 text-xl  font-semibold text-black dark:text-white">
        LAST 10 BOOKINGS
      </h4>

      {/* Table Container */}
      <div className="relative overflow-x-auto rounded-lg shadow">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          {/* Table Head */}
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-4 py-3">Name</th>
              <th scope="col" className="px-4 py-3">Start Time</th>
              <th scope="col" className="px-4 py-3">Price</th>
              <th scope="col" className="px-4 py-3">Date</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {bookings.length > 0 ? (
              bookings.map((booking) => {
                const bookingDate = format(
                  new Date(booking.booking_date),
                  "MMM d, yyyy"
                );

                return (
                  <tr
                    key={booking.id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {booking.name}
                    </td>
                    <td className="px-4 py-3">
                      {booking.start_time}
                    </td>
                    <td className="px-4 py-3">
                      ${booking.price}
                    </td>
                    <td className="px-4 py-3">
                      {bookingDate}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-3 text-center">
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableOne;
