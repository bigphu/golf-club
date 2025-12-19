import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { api } from '../services';
import { useAuth } from '../context';
import { CardProfile, Loading, EditProfileModal } from '../components';

const mapDataToUser = (data) => ({
  userId: data.user_id,
  firstName: data.first_name,
  lastName: data.last_name,
  email: data.email,
  phoneNumber: data.phone_number,
  bio: data.bio,
  profilePicUrl: data.profile_pic_url,
  backgroundColorHex: data.background_color_hex,
  vgaNumber: data.vga_number,
  shirtSize: data.shirt_size,
});

const Profile = () => {
  const { userId } = useParams(); 
  const { token, user: currentUser } = useAuth();
  
  const [userProfile, setUserProfile] = useState(null);
  const [stats, setStats] = useState({ tournaments: 0, documents: 0 });
  const [role, setRole] = useState('Member');
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        const endpoint = userId ? `/profile?userId=${userId}` : '/profile';
        const data = await api.get(endpoint, token);

        setStats({
          tournaments: data.stat_tournaments || 0,
          documents: data.stat_documents_read || 0
        });
        setRole(data.role); 
        setUserProfile(mapDataToUser(data));
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) fetchProfileData();
  }, [token, userId]);

  const handleUpdateProfile = async (updatedData) => {
    try {
      const data = await api.put('/profile', updatedData, token);
      setUserProfile(mapDataToUser(data)); 
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile");
    }
  };

  if (isLoading) return <Loading fullScreen text="Loading profile..." />;

  const isOwnProfile = !userId || (currentUser && currentUser.id.toString() === userId);

  return (
    <>
      <div className='col-start-2 col-span-10 flex flex-col min-h-[10vh] p-8 pb-0 items-center justify-center bg-transparent '>
        <div className='font-outfit text-primary-accent text-6xl font-extrabold'>Member Profile</div>
        <div className='text-secondary-accent font-medium font-roboto'>
          {isOwnProfile ? "Manage your membership" : `Viewing profile of ${userProfile?.firstName}`}
        </div>
      </div>

      <div className="col-start-4 col-span-6 mb-8">
        <CardProfile 
          user={userProfile} 
          role={role}
          stats={stats} 
          allowEdit={isOwnProfile}
          onEditProfile={isOwnProfile ? () => setIsEditing(true) : undefined}
        />
      </div>
      <div className="col-span-12 h-16"></div>

      {isEditing && (
        <EditProfileModal 
          user={userProfile}
          onClose={() => setIsEditing(false)}
          onSave={handleUpdateProfile}
        />
      )}
    </>
  );
};

export default Profile;