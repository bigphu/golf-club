import { useAuth } from '../context'; // Assuming index.js exports useAuth

export const useRole = () => {
  const { user } = useAuth();

  // 1. Basic Boolean Helpers
  const isAdmin = user?.role === 'ADMIN';
  const isMember = user?.role === 'MEMBER';
  
  // 2. Flexible Check Function
  // Usage: if (hasRole(['ADMIN', 'MEMBER'])) ...
  const hasRole = (allowedRoles = []) => {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  };

  return {
    role: user?.role,
    isAdmin,
    isMember,
    hasRole
  };
};