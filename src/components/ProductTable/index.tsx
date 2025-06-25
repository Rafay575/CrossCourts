import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaSearch } from "react-icons/fa";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { format } from "date-fns";
import * as XLSX from "xlsx";
import { baseUrl } from "../../api/baseUrl";

// ------------------ Types ------------------
type Booking = {
  id: number;
  court_id: number;
  start_time: string;    // e.g. "09:00:00"
  end_time: string;      // e.g. "10:00:00"
  name: string;
  phone: string;
  email: string;
  online_price: number;
  cash_price: number;
  add_on: string;
  add_on_price: number;
  booking_date: string;  // e.g. "2025-02-15"
  created_at: string;
};

type Court = {
  id: number;
  name: string;
  // Add other fields like location if needed
};

// ------------------ Fetch Functions ------------------
const fetchBookings = async (): Promise<Booking[]> => {
  const res = await fetch(`${baseUrl}/api/booking-history`);
  if (!res.ok) throw new Error("Failed to fetch bookings");
  return res.json();
};

const fetchCourts = async (): Promise<Court[]> => {
  const res = await fetch(`${baseUrl}/api/courts`);
  if (!res.ok) throw new Error("Failed to fetch courts");
  return res.json();
};

const ProductTable: React.FC = () => {
  // ------------------ Local State ------------------
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // ------------------ Queries ------------------
  // 1) Bookings
  const {
    data: bookings = [],
    isLoading: isBookingsLoading,
    isError: isBookingsError,
  } = useQuery<Booking[], Error>({
    queryKey: ["bookings"],
    queryFn: fetchBookings,
  });

  // 2) Courts
  const {
    data: courts = [],
    isLoading: isCourtsLoading,
    isError: isCourtsError,
  } = useQuery<Court[], Error>({
    queryKey: ["courts"],
    queryFn: fetchCourts,
  });

  // Build a map court_id -> courtName for quick lookup
  const courtNameMap = React.useMemo(() => {
    const map: Record<number, string> = {};
    courts.forEach((c) => {
      map[c.id] = c.name;
    });
    return map;
  }, [courts]);

  // ------------------ Filtering ------------------
  // We'll allow searching by name or phone
  const filteredBookings = bookings.filter((booking) => {
    const searchData = (booking.name + booking.phone).toLowerCase();
    return searchData.includes(searchTerm.toLowerCase());
  });

  // ------------------ Pagination ------------------
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedBookings = filteredBookings.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // ------------------ Excel Download Function ------------------
  const downloadExcel = () => {
    // Map bookings to an array of objects with the desired headings
    const exportData = bookings.map((booking) => ({
      Name: booking.name,
      Court: courtNameMap[booking.court_id] || "Unknown Court",
      Date: format(new Date(booking.booking_date), "MMM d, yyyy"),
      "Start Time": booking.start_time,
      "End Time": booking.end_time,
      Phone: booking.phone,
      Email: booking.email,
      "Online Price": booking.online_price,
      "Cash Price": booking.cash_price,
      "Add On": booking.add_on,
      "Add On Price": booking.add_on_price,
    }));

    // Create a worksheet and a new workbook
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");

    // Write the workbook to file and trigger download
    XLSX.writeFile(workbook, "bookings.xlsx");
  };

  // ------------------ Loading / Error States ------------------
  if (isBookingsLoading || isCourtsLoading) {
    return <div className="p-4 text-center">Loading data...</div>;
  }
  if (isBookingsError || isCourtsError) {
    return <div className="p-4 text-center text-red-600">Error fetching data.</div>;
  }

  // ------------------ Render Table ------------------
  return (
    <div className="dark:bg-boxdark-2 border-2 dark:border-boxdark dark:text-bodydark p-4 sm:p-6 rounded-lg shadow-md">
      {/* Search Row and Download Button */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        {/* Search Bar */}
        <div className="relative w-full md:w-1/2">
          <input
            type="text"
            placeholder="Search bookings by name or phone..."
            className="w-full p-2 pl-10 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset pagination on new search
            }}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-500 dark:text-gray-400" />
        </div>
        {/* Download Excel Button */}
        <button
          onClick={downloadExcel}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Download Excel
        </button>
      </div>

      {/* Table */}
      <div className="relative overflow-x-auto rounded-lg shadow">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Name</th>
              <th scope="col" className="px-6 py-3">Court</th>
              <th scope="col" className="px-6 py-3">Date</th>
              <th scope="col" className="px-6 py-3">Start Time</th>
              <th scope="col" className="px-6 py-3">End Time</th>
              <th scope="col" className="px-6 py-3">Phone</th>
              <th scope="col" className="px-6 py-3">Email</th>
              <th scope="col" className="px-6 py-3">Online Price</th>
              <th scope="col" className="px-6 py-3">Cash Price</th>
              <th scope="col" className="px-6 py-3">Add On</th>
              <th scope="col" className="px-6 py-3">Add On Price</th>
            </tr>
          </thead>
          <tbody>
            {displayedBookings.length > 0 ? (
              displayedBookings.map((booking) => {
                const courtName = courtNameMap[booking.court_id] || "Unknown Court";
                return (
                  <tr
                    key={booking.id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {booking.name}
                    </td>
                    <td className="px-6 py-4">{courtName}</td>
                    <td className="px-6 py-4">
                      {format(new Date(booking.booking_date), "MMM d, yyyy")}
                    </td>
                    <td className="px-6 py-4">{booking.start_time}</td>
                    <td className="px-6 py-4">{booking.end_time}</td>
                    <td className="px-6 py-4">{booking.phone}</td>
                    <td className="px-6 py-4">{booking.email}</td>
                    <td className="px-6 py-4">{booking.online_price}</td>
                    <td className="px-6 py-4">{booking.cash_price}</td>
                    <td className="px-6 py-4">{booking.add_on}</td>
                    <td className="px-6 py-4">{booking.add_on_price}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={11} className="px-6 py-4 text-center">
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredBookings.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4">
          <button
            className={`p-2 rounded-md ${
              currentPage === 1
                ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                : "bg-primary text-white"
            }`}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <MdNavigateBefore />
          </button>

          <span className="text-gray-700 dark:text-gray-400 my-2 sm:my-0">
            Page {currentPage} of {totalPages}
          </span>

          <button
            className={`p-2 rounded-md ${
              currentPage === totalPages
                ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                : "bg-primary text-white"
            }`}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <MdNavigateNext />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductTable;
