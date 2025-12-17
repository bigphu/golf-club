import React from 'react';
import { User, ArrowRight, Mail } from 'lucide-react';
import CardBase from './CardBase.jsx';

const CardUser = ({ user, role = 'Member', onAction }) => {
  const primaryColor = user.backgroundColorHex || '#3b82f6'; 
  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <CardBase
      primaryColor={primaryColor}
      Icon={User}
      title={fullName}
      subtitle={user.bio} 
      avatarUrl={user.profilePicUrl} 
      badgeLabel={role} 
      
      // New Metadata Format
      metaData={[
        { icon: Mail, text: user.email }
      ]}
      
      btnText="View Profile"
      BtnIcon={ArrowRight}
      onAction={onAction}
    />
  );
};

export default CardUser;