import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import MedicineDashboard from "./pages/MedicineDashboard";
import AIAssistant from "./pages/AIAssistant";
import WeatherDashboard from "./pages/WeatherDashboard";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import LandAnalysis from "./pages/LandAnalysis";
import Settings from "./pages/Settings";
import VideoTest from "./pages/VideoTest";
import NotFound from "./pages/NotFound";

import FallingLeaves from "@/components/ui/FallingLeaves";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <FallingLeaves />
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/medicine" element={<MedicineDashboard />} />
          <Route path="/ai-assistant" element={<AIAssistant />} />
          <Route path="/weather" element={<WeatherDashboard />} />
          <Route path="/analytics" element={<AnalyticsDashboard />} />
          <Route path="/land-analysis" element={<LandAnalysis />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/video-test" element={<VideoTest />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
