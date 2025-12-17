import React from 'react';
import { User, Edit3, ShieldCheck, Trophy, FileText, Mail, Phone, Hash, Shirt } from 'lucide-react';
import Button from './Button.jsx';

const CardProfile = ({
  user, // Corresponds to 'users' table row (camelCased)
  role = 'Member', // 'Member', 'Admin', or 'Guest'
  stats = { tournaments: 0, documents: 0 },
  allowEdit = false,
  onEditProfile,
  className = ''
}) => {
  if (!user) return null;

  // Use DB field: background_color_hex
  const primaryColor = user.backgroundColorHex || '#10b981'; // Default Emerald

  // Dynamic Styles
  const styles = {
    container: { borderColor: `${primaryColor}40` },
    header: { backgroundColor: `${primaryColor}10` },
    badge: { backgroundColor: `${primaryColor}20`, color: primaryColor, borderColor: `${primaryColor}40` },
    icon: { color: primaryColor }
  };

  return (
    <div 
      className={`w-full bg-white rounded-3xl border shadow-sm overflow-hidden flex flex-col ${className}`}
      style={styles.container}
    >
      
      {/* Header Section */}
      <div className="p-6 relative flex justify-between items-start h-36" style={styles.header}>
        {/* Avatar */}
        <div className="bg-white rounded-2xl shadow-sm p-1.5 inline-flex items-center justify-center border border-white/50 w-24 h-24 overflow-hidden">
          {user.profilePicUrl && user.profilePicUrl !== 'default_avatar.png' ? (
            <img src={user.profilePicUrl} alt="Profile" className="w-full h-full object-cover rounded-xl" />
          ) : (
            <User size={40} style={styles.icon} />
          )}
        </div>

        {/* Role Badge */}
        <div 
          className="text-xs font-bold px-4 py-2 rounded-full border font-outfit uppercase tracking-wide"
          style={styles.badge}
        >
          {role}
        </div>
      </div>

      {/* Body Section */}
      <div className="p-8 flex flex-col gap-6 grow bg-white">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-bold font-outfit text-txt-dark">
            {user.firstName} {user.lastName}
          </h2>
          <div className="flex items-center gap-2 text-txt-placeholder font-medium font-roboto text-sm">
            <Mail size={14} />
            <span>{user.email}</span>
          </div>
        </div>

        {/* Bio */}
        <div className="text-txt-dark leading-relaxed font-roboto bg-gray-50 p-4 rounded-xl border border-gray-100 overflow-x-hidden">
          <span className="text-xs font-bold uppercase text-txt-placeholder block mb-1">Bio</span>
          {user.bio || "No details provided."}
        </div>

        {/* Metadata Grid (Specific to 'users' table columns) */}
        <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
          
          {/* Row 1: Contact & Role */}
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3 text-sm font-medium text-txt-secondary">
                <Phone size={20} style={styles.icon} /> 
                <span>{user.phoneNumber}</span>
            </div>
            <div className="flex items-center gap-3 text-sm font-medium text-txt-secondary">
                <ShieldCheck size={20} style={styles.icon} /> 
                <span className="capitalize">{role}</span>
            </div>
          </div>

          {/* Row 2: Golf Specifics */}
          <div className="flex flex-wrap items-center gap-6 mt-2">
             {user.vgaNumber && (
                <div className="flex items-center gap-3 text-sm font-medium text-txt-secondary">
                    <Hash size={20} style={styles.icon} />
                    <span>VGA: <span className="text-txt-dark font-semibold">{user.vgaNumber}</span></span>
                </div>
             )}
             {user.shirtSize && (
                <div className="flex items-center gap-3 text-sm font-medium text-txt-secondary">
                    <Shirt size={20} style={styles.icon} />
                    <span>Size: <span className="text-txt-dark font-semibold">{user.shirtSize}</span></span>
                </div>
             )}
          </div>

        </div>

        {/* Edit Action */}
        { allowEdit && (
            <div className="mt-4">
              <Button onClick={onEditProfile} variant="secondary" className="w-full justify-center">
                <div className="flex items-center justify-center gap-2">
                  <Edit3 size={16} />
                  <span>Edit Profile</span>
                </div>
              </Button>
            </div>
          )
        }
      </div>
    </div>
  );
};

export default CardProfile;