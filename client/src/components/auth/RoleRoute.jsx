import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import ProtectedRoute from './ProtectedRoute';

export default function RoleRoute({ children, allowedRoles = [] }) {
  const { user } = useAuthStore();

  return (
    <ProtectedRoute>
      {allowedRoles.includes(user?.role) ? (
        children
      ) : (
        <Navigate to="/" replace />
      )}
    </ProtectedRoute>
  );
}