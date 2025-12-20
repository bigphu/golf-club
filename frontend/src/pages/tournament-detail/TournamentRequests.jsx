import React, { useState } from 'react';
import { useOutletContext, Navigate, useNavigate } from 'react-router-dom';
import { ShieldAlert, CheckCircle, RefreshCcw } from 'lucide-react';
import { api } from '@/services';
import { useAuth } from '@/context';
import { Tray, CardRequest, Button } from '@/components';

const TournamentRequests = () => {
  const { data, refreshData, currentUser } = useOutletContext();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [processingId, setProcessingId] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (currentUser.id !== data.details.creator_id) {
    return <Navigate to={`/tournament/${data.details.tournament_id}`} replace />;
  }

  const pendingParticipants = data.participants.filter(p => p.status === 'PENDING');

  const handleStatusChange = async (userId, newStatus) => {
    setProcessingId(userId);
    try {
      await api.post('/tournaments/manage', { 
        tournamentId: data.details.tournament_id, 
        targetUserId: userId, 
        status: newStatus 
      }, token);
      await refreshData();
    } catch (err) { 
      alert('Action failed: ' + err.message); 
    } finally {
      setProcessingId(null);
    }
  };

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
            <ShieldAlert className="text-txt-primary" size={24} />
            <h2 className="text-2xl font-bold font-outfit text-txt-primary">
              Pending Applications 
              <span className="text-lg bg-gray-100 text-txt-primary px-2.5 py-0.5 rounded-full ml-3 border border-orange-200">
                {pendingParticipants.length}
              </span>
            </h2>
          </div>
          <Button variant="ghost" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCcw size={18} className={isRefreshing ? 'animate-spin' : ''}/>
          </Button>
        </div>
      }
    >
      {pendingParticipants.length > 0 ? (
        pendingParticipants.map((p) => (
          <div key={p.user_id} className="w-full h-full animate-fadeIn">
            <CardRequest 
              participant={p} 
              isProcessing={processingId === p.user_id}
              onViewProfile={() => navigate(`/profile/${p.user_id}`)}
              onApprove={() => handleStatusChange(p.user_id, 'APPROVED')}
              onReject={() => handleStatusChange(p.user_id, 'REJECTED')}
            />
          </div>
        ))
      ) : (
        <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
          <CheckCircle size={40} className="text-green-300 mb-2"/>
          <p className="text-gray-500 font-medium font-outfit text-lg">All caught up!</p>
          <p className="text-gray-400 text-sm">No pending requests at the moment.</p>
        </div>
      )}
    </Tray>
  );
};

export default TournamentRequests;