import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// App pages
import Auth from "./pages/app/Auth";
import Onboarding from "./pages/app/Onboarding";
import RoleSelect from "./pages/app/RoleSelect";
import Home from "./pages/app/Home";
import Order from "./pages/app/Order";
import Payment from "./pages/app/Payment";
import Tracking from "./pages/app/Tracking";
import Profile from "./pages/app/Profile";
import ProfileEdit from "./pages/app/ProfileEdit";
import OrderHistory from "./pages/app/OrderHistory";
import PaymentMethods from "./pages/app/PaymentMethods";
import Notifications from "./pages/app/Notifications";
import Help from "./pages/app/Help";
import Settings from "./pages/app/Settings";
import Favorites from "./pages/app/Favorites";

// Provider pages
import ProviderDashboard from "./pages/app/ProviderDashboard";
import ProviderMission from "./pages/app/ProviderMission";
import ProviderRegister from "./pages/app/ProviderRegister";
import ProviderEarnings from "./pages/app/ProviderEarnings";
import ProviderReviews from "./pages/app/ProviderReviews";
import ProviderProfile from "./pages/app/ProviderProfile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Landing page */}
            <Route path="/" element={<Index />} />
            
            {/* Mobile app routes */}
            <Route path="/app/auth" element={<Auth />} />
            <Route path="/app/onboarding" element={<Onboarding />} />
            <Route path="/app/role-select" element={<RoleSelect />} />
            <Route path="/app" element={<Home />} />
            <Route path="/app/order" element={<Order />} />
            <Route path="/app/payment" element={<Payment />} />
            <Route path="/app/tracking" element={<Tracking />} />
            <Route path="/app/profile" element={<Profile />} />
            <Route path="/app/profile/edit" element={<ProfileEdit />} />
            <Route path="/app/profile/history" element={<OrderHistory />} />
            <Route path="/app/profile/payments" element={<PaymentMethods />} />
            <Route path="/app/profile/notifications" element={<Notifications />} />
            <Route path="/app/help" element={<Help />} />
            <Route path="/app/settings" element={<Settings />} />
            <Route path="/app/favorites" element={<Favorites />} />
            
            {/* Provider routes */}
            <Route path="/app/provider" element={<ProviderDashboard />} />
            <Route path="/app/provider/mission" element={<ProviderMission />} />
            <Route path="/app/provider/register" element={<ProviderRegister />} />
            <Route path="/app/provider/earnings" element={<ProviderEarnings />} />
            <Route path="/app/provider/reviews" element={<ProviderReviews />} />
            <Route path="/app/provider/profile" element={<ProviderProfile />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
