import { Toaster } from "@/components/ui/sonner";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { NotFound } from './pages/NotFound';
import { Index } from "./pages/Index";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
const queryClient = new QueryClient();

function App() {

  return (
    <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />}/>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      
    </TooltipProvider>
    </QueryClientProvider>
  )
}

export default App
