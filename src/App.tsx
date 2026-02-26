import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import OtoPage from "./pages/OtoPage";
import ThankYouPage from "./pages/ThankuFree";
import GaPage from "./pages/GaPage";
import TyPage from "./pages/TyPage";
import OtoTyPage from "./pages/OtoTyPage";
import IndexFb from "./pages/IndexFb";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/fb" element={<IndexFb />} />
          <Route path="/oto" element={<OtoPage />} />
          <Route path="/ototy" element={<OtoTyPage />} />
          <Route path="/ty" element={<ThankYouPage />} />
          <Route path="/ga" element={<GaPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
