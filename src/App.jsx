import { Route, BrowserRouter, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import React from "react";
import BillsPage from "@/components/pages/BillsPage";
import HomePage from "@/components/pages/HomePage";
import TransferPage from "@/components/pages/TransferPage";
import MorePage from "@/components/pages/MorePage";
import CardsPage from "@/components/pages/CardsPage";
import SavingsGoalsPage from "@/components/pages/SavingsGoalsPage";
import KYCOnboardingPage from "@/components/pages/KYCOnboardingPage";
import Navigation from "@/components/organisms/Navigation";

function App() {
  return (
<BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        {/* Main Content Area */}
        <main className="lg:ml-64 lg:pt-0 pt-16 pb-20 lg:pb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
<Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/transfer" element={<TransferPage />} />
              <Route path="/bills" element={<BillsPage />} />
              <Route path="/savings-goals" element={<SavingsGoalsPage />} />
              <Route path="/cards" element={<CardsPage />} />
              <Route path="/more" element={<MorePage />} />
              <Route path="/kyc-onboarding" element={<KYCOnboardingPage />} />
            </Routes>
          </div>
        </main>

        {/* Toast Notifications */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
</BrowserRouter>
  );
}

export default App;