import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LoadingSpinner from './components/ui/LoadingSpinner';
import ErrorBoundary from './components/ui/ErrorBoundary';

// Public pages
import HomePage from './pages/public/HomePage';
import BrowsePage from './pages/public/BrowsePage';
import ListingDetailPage from './pages/public/ListingDetailPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';

// Protected pages
import ProfilePage from './pages/profile/ProfilePage';
import CartPage from './pages/cart/CartPage';
import CheckoutPage from './pages/checkout/CheckoutPage';
import OrdersPage from './pages/orders/OrdersPage';
import OrderDetailPage from './pages/orders/OrderDetailPage';
import MessagesPage from './pages/messages/MessagesPage';

// Farmer pages
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import MyListingsPage from './pages/farmer/MyListingsPage';
import CreateListingPage from './pages/farmer/CreateListingPage';
import EditListingPage from './pages/farmer/EditListingPage';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminListingsPage from './pages/admin/AdminListingsPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';

// Route guards
import ProtectedRoute from './components/auth/ProtectedRoute';
import RoleRoute from './components/auth/RoleRoute';

function App() {
  const { initialize, isLoading, user } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/browse" element={<BrowsePage />} />
            <Route path="/listings/:id" element={<ListingDetailPage />} />
            
            {/* Auth Routes */}
            <Route 
              path="/login" 
              element={user ? <Navigate to="/" /> : <LoginPage />} 
            />
            <Route 
              path="/register" 
              element={user ? <Navigate to="/" /> : <RegisterPage />} 
            />
            <Route 
              path="/forgot-password" 
              element={user ? <Navigate to="/" /> : <ForgotPasswordPage />} 
            />
            <Route 
              path="/reset-password/:token" 
              element={user ? <Navigate to="/" /> : <ResetPasswordPage />} 
            />
            <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
            
            {/* Protected Routes */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            
            <Route path="/cart" element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            } />
            
            <Route path="/checkout" element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            } />
            
            <Route path="/orders" element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            } />
            
            <Route path="/orders/:id" element={
              <ProtectedRoute>
                <OrderDetailPage />
              </ProtectedRoute>
            } />
            
            <Route path="/messages" element={
              <ProtectedRoute>
                <MessagesPage />
              </ProtectedRoute>
            } />
            
            {/* Farmer Routes */}
            <Route path="/farmer/dashboard" element={
              <RoleRoute allowedRoles={['farmer']}>
                <FarmerDashboard />
              </RoleRoute>
            } />
            
            <Route path="/farmer/listings" element={
              <RoleRoute allowedRoles={['farmer']}>
                <MyListingsPage />
              </RoleRoute>
            } />
            
            <Route path="/farmer/listings/create" element={
              <RoleRoute allowedRoles={['farmer']}>
                <CreateListingPage />
              </RoleRoute>
            } />
            
            <Route path="/farmer/listings/:id/edit" element={
              <RoleRoute allowedRoles={['farmer']}>
                <EditListingPage />
              </RoleRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <RoleRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </RoleRoute>
            } />
            
            <Route path="/admin/users" element={
              <RoleRoute allowedRoles={['admin']}>
                <AdminUsersPage />
              </RoleRoute>
            } />
            
            <Route path="/admin/listings" element={
              <RoleRoute allowedRoles={['admin']}>
                <AdminListingsPage />
              </RoleRoute>
            } />
            
            <Route path="/admin/orders" element={
              <RoleRoute allowedRoles={['admin']}>
                <AdminOrdersPage />
              </RoleRoute>
            } />
            
            {/* Catch all */}
            <Route path="*" element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                  <p className="text-gray-600 mb-8">Page not found</p>
                  <button 
                    onClick={() => window.history.back()} 
                    className="btn-primary"
                  >
                    Go Back
                  </button>
                </div>
              </div>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default App;