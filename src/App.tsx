import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { MobileBottomNav } from './components/navigation/MobileBottomNav';
import { PWAInstallPrompt } from './components/ui/PWAInstallPrompt';
import { ThemeProvider } from './context/ThemeContext';

// Route-level code splitting for optimized bundle loading and fast FCP/LCP
const Home = lazy(() => import('./pages/Home').then((m) => ({ default: m.Home })));
const BuyCars = lazy(() => import('./pages/BuyCars').then((m) => ({ default: m.BuyCars })));
const SellCar = lazy(() => import('./pages/SellCar').then((m) => ({ default: m.SellCar })));
const VehicleDetails = lazy(() => import('./pages/VehicleDetails').then((m) => ({ default: m.VehicleDetails })));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard').then((m) => ({ default: m.AdminDashboard })));
const AdminLogin = lazy(() => import('./pages/AdminLogin').then((m) => ({ default: m.AdminLogin })));
const Auth = lazy(() => import('./pages/Auth').then((m) => ({ default: m.Auth })));
const TradeIn = lazy(() => import('./pages/TradeIn').then((m) => ({ default: m.TradeIn })));
const AuctionMarketplace = lazy(() => import('./pages/Auction').then((m) => ({ default: m.AuctionMarketplace })));
const ImportServicePage = lazy(() => import('./pages/ImportService').then((m) => ({ default: m.ImportServicePage })));
const AccountDashboard = lazy(() => import('./pages/Account').then((m) => ({ default: m.AccountDashboard })));
const AccessoriesPage = lazy(() => import('./pages/Accessories').then((m) => ({ default: m.AccessoriesPage })));
const TrackersPage = lazy(() => import('./pages/Trackers').then((m) => ({ default: m.TrackersPage })));
const CarHirePage = lazy(() => import('./pages/CarHire').then((m) => ({ default: m.CarHirePage })));
const DealershipsPage = lazy(() => import('./pages/Dealerships').then((m) => ({ default: m.DealershipsPage })));
const AboutPage = lazy(() => import('./pages/About').then((m) => ({ default: m.AboutPage })));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy').then((m) => ({ default: m.PrivacyPolicy })));
const Terms = lazy(() => import('./pages/Terms').then((m) => ({ default: m.Terms })));
const NotFound = lazy(() => import('./pages/NotFound').then((m) => ({ default: m.NotFound })));

const PageLoader: React.FC = () => (
  <div className="min-h-screen bg-[#F4F8F6] dark:bg-[#001A13] flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="w-9 h-9 border-3 border-[#009E52]/20 dark:border-[#00E878]/20 border-t-[#009E52] dark:border-t-[#00E878] rounded-full animate-spin" />
      <span className="text-xs font-bold text-[#5F7E71] dark:text-[#8EA79C] tracking-wide">
        Loading...
      </span>
    </div>
  </div>
);

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Gateway & Informational Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/accessories" element={<AccessoriesPage />} />
            <Route path="/trackers" element={<TrackersPage />} />
            <Route path="/car-hire" element={<CarHirePage />} />
            <Route path="/dealerships" element={<DealershipsPage />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />

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

            {/* Protected Yard Admin Console - Strictly Restricted to Admin & Yard Admin Roles */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin', 'yard_admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Fallback to Branded Custom 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <MobileBottomNav />
        <PWAInstallPrompt />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
