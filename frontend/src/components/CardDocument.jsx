import React from 'react';
import { FileText, ShieldAlert, ExternalLink, User } from 'lucide-react';
import CardBase from './CardBase.jsx';

const CardDocument = ({ doc, authorName, onAction }) => {
  const config = doc.type === 'BCN_BYLAW' 
    ? { color: '#10b981', label: 'Official Doc', Icon: FileText }   
    : { color: '#8b5cf6', label: 'Benefit', Icon: ShieldAlert };    

  const dateStr = new Date(doc.createdAt).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric'
  });

  return (
    <CardBase
      primaryColor={config.color}
      Icon={config.Icon}
      title={doc.title}       
      subtitle={`Published: ${dateStr}`}
      badgeLabel={config.label}
      
      // New Metadata Format
      metaData={[
        { icon: User, text: authorName || 'Admin' }
      ]}

      btnText="Read Document"
      BtnIcon={ExternalLink}
      onAction={onAction}
    />
  );
};

export default CardDocument;