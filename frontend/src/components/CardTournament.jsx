import React from 'react';
import { Trophy, ArrowRight, User } from 'lucide-react';
import CardBase from './CardBase.jsx';

const CardTournament = ({ tournament, creatorName, onAction, onEdit }) => {
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'ONGOING': return '#22c55e';
      case 'UPCOMING': return '#3b82f6';
      case 'FINISHED': return '#f59e0b';
      case 'CANCELED': return '#ef4444';
      default: return '#64748b';
    }
  };

  const primaryColor = getStatusColor(tournament.status);

  return (
    <CardBase
      primaryColor={primaryColor}
      Icon={Trophy}
      title={tournament.name}          
      subtitle={`${tournament.location} • ${tournament.description}`} 
      avatarUrl={tournament.imageUrl}  
      badgeLabel={tournament.status}
      
      // New Metadata Format
      metaData={[
        { icon: User, text: creatorName || 'System Admin' }
      ]}

      btnText="View Details"
      BtnIcon={ArrowRight}
      onAction={onAction}
      onEdit={onEdit}
    />
  );
};

export default CardTournament;