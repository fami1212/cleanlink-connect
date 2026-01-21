import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// App pages
import Onboarding from "./pages/app/Onboarding";
import RoleSelect from "./pages/app/RoleSelect";
import Home from "./pages/app/Home";
import Order from "./pages/app/Order";
import Payment from "./pages/app/Payment";
import Tracking from "./pages/app/Tracking";
import Profile from "./pages/app/Profile";
import Favorites from "./pages/app/Favorites";
import ProviderDashboard from "./pages/app/ProviderDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Landing page */}
          <Route path="/" element={<Index />} />
          
          {/* Mobile app routes */}
          <Route path="/app/onboarding" element={<Onboarding />} />
          <Route path="/app/role-select" element={<RoleSelect />} />
          <Route path="/app" element={<Home />} />
          <Route path="/app/order" element={<Order />} />
          <Route path="/app/payment" element={<Payment />} />
          <Route path="/app/tracking" element={<Tracking />} />
          <Route path="/app/profile" element={<Profile />} />
          <Route path="/app/favorites" element={<Favorites />} />
          <Route path="/app/provider" element={<ProviderDashboard />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
