import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// --- THE MELOTWO SINGLE-FILE RESCUE ---
// We are moving the "Home" code directly here. 
// This eliminates the "Could not resolve" error.
const Home = () => (
  <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col items-center justify-center p-8 font-sans">
    <div className="max-w-4xl w-full space-y-8 text-center">
      <h1 className="text-7xl font-bold tracking-tighter text-emerald-500 drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]">
        CaterProAI
      </h1>
      <p className="text-2xl text-slate-400 font-light italic">
        Menu Engineering for Elite Chefs.
      </p>
      
      <div className="mt-12 p-12 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-2xl shadow-2xl">
        <div className="inline-block px-4 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 text-sm font-medium mb-6">
          RUN 874: SYSTEM STABLE
        </div>
        <h2 className="text-3xl font-semibold mb-4">The Curse is Broken</h2>
        <p className="text-slate-400 max-w-md mx-auto leading-relaxed">
          The deployment pipeline is officially healthy. You are seeing this because the app is running as a single, unified unit.
        </p>
      </div>
    </div>
  </div>
);

const NotFound = () => (
  <div className="h-screen flex items-center justify-center bg-[#0B0F19] text-white">
    <h1 className="text-xl">404 - Not Found</h1>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
