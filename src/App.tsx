import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Loader from "./common/Loader";
import PageTitle from "./components/PageTitle";
import SignIn from "./pages/Authentication/SignIn";
import SignUp from "./pages/Authentication/SignUp";
import ECommerce from "./pages/Dashboard/ECommerce";
import BookingHistory from "./pages/BookingHistory";
import BookingManagement from "./pages/BookingManagement";
import BookingSettings from "./pages/BookingSettings";
import CustomMessage from "./pages/CustomMessage";
import DefaultLayout from "./layout/DefaultLayout";
import ProtectedRoute from "./common/ProtectedRoute"; // Import ProtectedRoute

function App() {
    const [loading, setLoading] = useState(true);
    const { pathname } = useLocation();

    // Scroll to top when the route changes
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    // Simulate a loading delay (e.g. fetching data or assets)
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    if (loading) return <Loader />;

    return (
        <Routes>
            {/* ----- Auth Routes (Accessible Without Login) ----- */}
            <Route path="/auth/signin" element={<><PageTitle title="Signin | CrossCourts" /><SignIn /></>} />
          
            {/* ----- Secure Routes Wrapped in ProtectedRoute ----- */}
         
                <Route element={<DefaultLayout />}>
                    <Route index element={<><PageTitle title="Dashboard" /><ECommerce /></>} />
                    <Route path="/booking-management" element={<><PageTitle title="Booking Management" /><BookingManagement /></>} />
                    <Route path="/booking-history" element={<><PageTitle title="Booking History" /><BookingHistory /></>} />
                  
                    <Route path="/custom-message" element={<><PageTitle title="Custom Message" /><CustomMessage /></>} />
                </Route>
          
        </Routes>
    );
}

export default App;
