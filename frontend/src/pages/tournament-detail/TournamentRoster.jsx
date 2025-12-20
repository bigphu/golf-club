import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Users, RefreshCcw } from 'lucide-react';
import { Tray, CardUser, Button } from '@/components';

const TournamentRoster = () => {
  const { data, refreshData } = useOutletContext();
  const navigate = useNavigate();
  const approvedParticipants = data.participants.filter(p => p.status === 'APPROVED');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setIsRefreshing(false);
  };

  return (
    <Tray 
      pos="col-start-2" 
      size="col-span-10" 
      variant="grid"
      title={
        <div className="flex items-center justify-between pb-4 mb-2 border-b border-gray-100 w-full animate-fadeIn">
          <div className="flex items-center gap-2">
            <Users className="text-primary-accent" size={24} />
            <h2 className="text-2xl font-bold font-outfit text-primary-accent">
              Official Roster 
              <span className="text-lg bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full ml-3 border border-gray-200">
                {approvedParticipants.length}
              </span>
            </h2>
          </div>
          <Button variant="ghost" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCcw size={18} className={isRefreshing ? 'animate-spin' : ''}/>
          </Button>
        </div>
      }
    >
      {approvedParticipants.length > 0 ? (
        approvedParticipants.map((p) => (
          <div key={p.user_id} className="w-full h-full animate-fadeIn">
            <CardUser 
              user={{
                firstName: p.first_name,
                lastName: p.last_name,
                profilePicUrl: p.profile_pic_url,
                bio: p.vga_number ? `VGA: ${p.vga_number}` : 'No VGA Number',
                backgroundColorHex: p.background_color_hex,
                email: p.email 
              }}
              role="PARTICIPANT"
              onAction={() => navigate(`/profile/${p.user_id}`)}
            />
          </div>
        ))
      ) : (
        <div className="col-span-full py-16 text-center text-gray-400 italic font-medium">
          No confirmed participants yet.
        </div>
      )}
    </Tray>
  );
};

export default TournamentRoster;