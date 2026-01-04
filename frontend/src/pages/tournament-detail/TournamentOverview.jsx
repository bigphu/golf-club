import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Trophy, DollarSign, Users, User, Flag, Edit, Calendar } from 'lucide-react';

import { api } from '@/services';
import { useAuth } from '@/context'; 
import { Tray, Button, EditTournamentModal, StatBox } from '@/components';

const TournamentOverview = () => {
  const { data, refreshData, currentUser } = useOutletContext();
  const { token } = useAuth();
  const { details, participants } = data;
  
  const [registering, setRegistering] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const userRegistration = participants.find(p => p.user_id === currentUser.id);
  const isUpcoming = details.status === 'UPCOMING';
  const isHost = currentUser.id === details.creator_id;

  const handleRegister = async () => {
    if (!window.confirm("Confirm registration?")) return;
    setRegistering(true);
    try {
      await api.post('/tournaments/register', { tournamentId: details.tournament_id }, token);
      alert("Application submitted! Check back for host approval.");
      refreshData(); 
    } catch (error) {
      alert(error.message);
    } finally {
      setRegistering(false);
    }
  };

  const handleUpdate = async (updatedData) => {
    try {
      await api.put(`/tournaments/${details.tournament_id}`, updatedData, token);
      alert("Tournament updated successfully!");
      await refreshData(); 
      setIsEditing(false);
    } catch (error) {
      alert("Error updating tournament: " + error.message);
    }
  };

  return (
    <>
      <Tray pos="col-start-2" size="col-span-10" variant="flex" className="relative">
        {isHost && (
          <div className="absolute top-4 right-4 z-10">
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => setIsEditing(true)} 
              className="flex gap-2 bg-white/80 backdrop-blur-sm border-gray-200"
            >
              <Edit size={16} /> Edit Details
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 w-full animate-fadeIn items-stretch">
          
          {/* Left Column: Visual Banner */}
          <div className="col-span-12 md:col-span-5">
            <div className="rounded-2xl border border-gray-100 overflow-hidden relative aspect-4/5 shadow-inner bg-gray-50">
              <img 
                src={details.image_url} 
                alt={details.name} 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
              />
            </div>
          </div>

          {/* Right Column: Information Hub */}
          <div className="col-span-12 md:col-span-7 flex flex-col">
            <div className="flex flex-col h-full">
              
              <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
                <Trophy size={20} className="text-primary-accent" />
                <h3 className="text-xl font-bold font-outfit text-primary-accent uppercase tracking-tight">
                  Tournament Brief
                </h3>
              </div>
              
              {/* Markdown Render Area */}
              <div className="prose max-w-none text-left grow w-full overflow-y-auto max-h-[300px] pr-4 font-roboto scrollbar-thin scrollbar-thumb-gray-200">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {details.description}
                </ReactMarkdown>
              </div>

              {/* NEW: Tournament Metrics in 2x2 Grid */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                <StatBox label="Format" value={details.format || 'Stroke Play'} icon={Trophy} />
                <StatBox label="Entry Fee" value={`$${details.entry_fee}`} icon={DollarSign} />
                <StatBox label="Availability" value={`${details.current_participants}/${details.max_participants} Slots`} icon={Users} />
                <StatBox label="Organizer" value={details.creator_name} icon={User} />
              </div>
              
              {/* Registration Logic */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                {!userRegistration ? (
                  isUpcoming ? (
                    <Button 
                      onClick={handleRegister} 
                      isLoading={registering} 
                      className="w-full py-4 text-lg flex justify-center gap-2 shadow-xl shadow-primary-accent/20"
                    >
                      <Flag size={20} /> Join Tournament
                    </Button>
                  ) : (
                    <div className="p-4 text-center bg-gray-100 rounded-xl text-gray-500 font-bold w-full uppercase tracking-widest border border-dashed border-gray-300">
                      Registration Closed
                    </div>
                  )
                ) : (
                  <div className={`p-4 text-center rounded-xl font-bold border-2 w-full flex flex-col items-center gap-1 ${getStatusStyle(userRegistration.status)}`}>
                    <span className="text-xs opacity-70 uppercase tracking-widest">Your Entry Status</span>
                    <span className="text-xl">{userRegistration.status}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Tray>

      {isEditing && (
        <EditTournamentModal 
          tournament={details} 
          onClose={() => setIsEditing(false)} 
          onSave={handleUpdate} 
        />
      )}
    </>
  );
};

const getStatusStyle = (status) => {
  switch(status) {
    case 'APPROVED': return 'bg-green-50 text-green-700 border-green-200';
    case 'REJECTED': return 'bg-red-50 text-red-700 border-red-200';
    default: return 'bg-amber-50 text-amber-700 border-amber-200';
  }
};

export default TournamentOverview;