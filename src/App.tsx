import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { Home } from './pages/Home';
import { BuyCars } from './pages/BuyCars';
import { SellCar } from './pages/SellCar';
import { VehicleDetails } from './pages/VehicleDetails';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminLogin } from './pages/AdminLogin';
import { Auth } from './pages/Auth';
import { TradeIn } from './pages/TradeIn';
import { AuctionMarketplace } from './pages/Auction';
import { ImportServicePage } from './pages/ImportService';
import { AccountDashboard } from './pages/Account';
import { AccessoriesPage } from './pages/Accessories';
import { TrackersPage } from './pages/Trackers';
import { CarHirePage } from './pages/CarHire';
import { DealershipsPage } from './pages/Dealerships';
import { AboutPage } from './pages/About';

import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { MobileBottomNav } from './components/navigation/MobileBottomNav';
import { PWAInstallPrompt } from './components/ui/PWAInstallPrompt';

export const App: React.FC = () => {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        {/* Public Gateway & Informational Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/accessories" element={<AccessoriesPage />} />
        <Route path="/trackers" element={<TrackersPage />} />
        <Route path="/car-hire" element={<CarHirePage />} />
        <Route path="/dealerships" element={<DealershipsPage />} />

        {/* Public Authentication Gateways */}
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Dashboard & Marketplace Feature Routes */}
        <Route
          path="/buy"
          element={
            <ProtectedRoute>
              <BuyCars />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sell"
          element={
            <ProtectedRoute>
              <SellCar />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vehicles/:id"
          element={
            <ProtectedRoute>
              <VehicleDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trade-in"
          element={
            <ProtectedRoute>
              <TradeIn />
            </ProtectedRoute>
          }
        />
        <Route
          path="/auction"
          element={
            <ProtectedRoute>
              <AuctionMarketplace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/import"
          element={
            <ProtectedRoute>
              <ImportServicePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <AccountDashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected Yard Admin Console - Strictly Restricted to Admin Role */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback to Landing Gateway */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
      <MobileBottomNav />
      <PWAInstallPrompt />
    </BrowserRouter>
  );
};

export default App;
