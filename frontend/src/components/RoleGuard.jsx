import React from 'react';
import PropTypes from 'prop-types';

import { useRole } from '@/hooks';

const RoleGuard = ({ children, allowedRoles, fallback = null }) => {
  const { hasRole } = useRole();

  if (!hasRole(allowedRoles)) {
    return fallback; // Render nothing, or a specific "Access Denied" message
  }

  return <>{children}</>;
};

RoleGuard.propTypes = {
  children: PropTypes.node,
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
  fallback: PropTypes.node,
};

export default RoleGuard;