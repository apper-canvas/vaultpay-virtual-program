import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import React from "react";
import AnalyticsPage from "@/components/pages/AnalyticsPage";
import ApplyCardsPage from "@/components/pages/ApplyCardsPage";
import DepositsPage from "@/components/pages/DepositsPage";
import InvestmentsPage from "@/components/pages/InvestmentsPage";
import InsurancePage from "@/components/pages/InsurancePage";
import CalculatorPage from "@/components/pages/CalculatorPage";
import ChatBot from "@/components/molecules/ChatBot";
import BillsPage from "@/components/pages/BillsPage";
import HomePage from "@/components/pages/HomePage";
import SavingsGoalsPage from "@/components/pages/SavingsGoalsPage";
import TransferPage from "@/components/pages/TransferPage";
import MorePage from "@/components/pages/MorePage";
import CardsPage from "@/components/pages/CardsPage";
import ProfilePage from "@/components/pages/ProfilePage";
import KYCOnboardingPage from "@/components/pages/KYCOnboardingPage";
import TransactionHistoryPage from "@/components/pages/TransactionHistoryPage";
import StatementsPage from "@/components/pages/StatementsPage";
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
                    <Route path="/transactions" element={<TransactionHistoryPage />} />
                    <Route path="/statements" element={<StatementsPage />} />
                    <Route path="/analytics" element={<AnalyticsPage />} />
                    <Route path="/savings-goals" element={<SavingsGoalsPage />} />
                    <Route path="/cards" element={<CardsPage />} />
                    <Route path="/more" element={<MorePage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/kyc-onboarding" element={<KYCOnboardingPage />} />
                    <Route path="/apply-cards" element={<ApplyCardsPage />} />
                    <Route path="/deposits" element={<DepositsPage />} />
<Route path="/investments" element={<InvestmentsPage />} />
                    <Route path="/insurance" element={<InsurancePage />} />
                    <Route path="/calculator" element={<CalculatorPage />} />
                </Routes></div>
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
            theme="light" />
        {/* AI ChatBot */}
        <ChatBot />
    </div>
</BrowserRouter>
  );
}

export default App;