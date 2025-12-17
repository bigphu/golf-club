import React from 'react';
import { FileText, Bell, CheckCircle, ExternalLink, ShieldAlert } from 'lucide-react';
import CardBase from './CardBase.jsx';

const CardContent = ({ itemId, title, authorName, timestamp, variant, actionLabel, onAction }) => {
  
  // Logic: Format Timestamp
  const renderTime = () => {
    if (!timestamp) return "Date Unknown";
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-GB', { 
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
  };

  // Logic: Variant Configuration (Documents vs Notifications)
  const getConfig = (variantType) => {
    switch (variantType) {
      case 'BCN_BYLAW':
        return {
          colors: {
            border: 'border border-emerald-200',
            bgBadge: 'bg-emerald-100', textBadge: 'text-emerald-700', borderBadge: 'border-emerald-200',
            bgHeader: 'bg-emerald-50', textHeader: 'text-emerald-600', textHover: 'group-hover:text-emerald-600',
          },
          Icon: FileText, label: 'Official Doc', btnText: 'Read PDF', btnIcon: ExternalLink
        };
      case 'BENEFIT':
        return {
          colors: {
            border: 'border border-purple-200',
            bgBadge: 'bg-purple-100', textBadge: 'text-purple-700', borderBadge: 'border-purple-200',
            bgHeader: 'bg-purple-50', textHeader: 'text-purple-600', textHover: 'group-hover:text-purple-600',
          },
          Icon: ShieldAlert, label: 'Benefit', btnText: 'View Details', btnIcon: ExternalLink
        };
      case 'NOTIFICATION':
      default:
        return {
          colors: {
            border: 'border border-orange-200',
            bgBadge: 'bg-orange-100', textBadge: 'text-orange-700', borderBadge: 'border-orange-200',
            bgHeader: 'bg-orange-50', textHeader: 'text-orange-600', textHover: 'group-hover:text-orange-600',
          },
          Icon: Bell, label: 'Alert', btnText: 'Mark Read', btnIcon: CheckCircle
        };
    }
  };

  const config = getConfig(variant);

  return (
    <CardBase
      colors={config.colors}
      Icon={config.Icon}
      itemId={itemId}
      title={title}
      subtitle={renderTime()}
      memberName={authorName}
      badgeLabel={config.label}
      btnText={actionLabel || config.btnText}
      BtnIcon={config.btnIcon}
      onAction={onAction}
    />
  );
};

export default CardContent;