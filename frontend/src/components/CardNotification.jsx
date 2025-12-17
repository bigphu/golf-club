import React from 'react';
import { Bell, CheckCircle, User } from 'lucide-react';
import CardBase from './CardBase.jsx';

const CardNotification = ({ notification, authorName, onAction }) => {
  const primaryColor = '#f97316'; 

  return (
    <CardBase
      primaryColor={primaryColor}
      Icon={Bell}
      title={notification.title}           
      subtitle={notification.content}      
      badgeLabel="Alert"
      
      // New Metadata Format
      metaData={[
        { icon: User, text: authorName || 'System' }
      ]}

      btnText="Mark Read"
      BtnIcon={CheckCircle}
      onAction={onAction}
    />
  );
};

export default CardNotification;