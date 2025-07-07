
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import BusinessNew from "./pages/BusinessNew";
import BusinessDetails from "./pages/BusinessDetails";
import BusinessSettings from "./pages/BusinessSettings";
import Bookings from "./pages/Bookings";
import Customers from "./pages/Customers";
import Services from "./pages/Services";
import ServiceNew from "./pages/ServiceNew";
import Profile from "./pages/Profile";
import BookingPublic from "./pages/BookingPublic";
import AdminRegister from "./pages/AdminRegister";
import NotFound from "./pages/NotFound";
import Demo from "./pages/Demo";
import BusinessDirectory from "./pages/BusinessDirectory";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/businesses" element={<BusinessDirectory />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/business/new" element={<BusinessNew />} />
            <Route path="/business/:id" element={<BusinessDetails />} />
            <Route path="/business/:id/settings" element={<BusinessSettings />} />
            <Route path="/booking/:businessId" element={<BookingPublic />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/new" element={<ServiceNew />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin/register" element={<AdminRegister />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
