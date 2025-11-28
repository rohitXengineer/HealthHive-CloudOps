// src/components/ProtectedSection.jsx
import { useAuth } from "../AuthContext";

export default function ProtectedSection({ children, roles, allowedRoles }) {
  // support either `roles` (legacy) or `allowedRoles` (clearer)
  const { user, hasAnyRole } = useAuth();
  const checkRoles = allowedRoles || roles;

  if (!user) {
    return <p>Please login to view this section.</p>;
  }

  if (checkRoles && Array.isArray(checkRoles) && checkRoles.length > 0) {
    if (!hasAnyRole(checkRoles)) {
      return <p>You do not have permission to access this section.</p>;
    }
  }

  return children;
}
