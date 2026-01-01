import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { MapPin, Clock, List, Users, ShieldAlert } from 'lucide-react';

import { useAuth } from '@/context';
import { api } from '@/services';
import { formatDateTimeRange } from '@/utils';
import { Button, ViewToggle, Loading } from '@/components';

const TournamentLayout = () => {
  const { id } = useParams();
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDetails = async () => {
    try {
      const json = await api.get(`/tournaments/${id}`, token);
      setData(json);
      console.log("Tournament details loaded:", json);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchDetails(); }, [id, token]);

  if (loading) return <Loading />;
  if (!data) return <div className="text-center p-10">Tournament not found</div>;

  const { details, participants } = data;
  const isCreator = user.id === details.creator_id;
  
  // Counts are still needed here for the Tab Labels
  const approvedCount = participants.filter(p => p.status === 'APPROVED').length;
  const pendingCount = participants.filter(p => p.status === 'PENDING').length;

  // --- Navigation Logic ---
  const currentPath = location.pathname.split('/').pop();
  const activeTab = currentPath === id ? 'overview' : currentPath;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: List },
    { id: 'roster', label: `Roster (${approvedCount})`, icon: Users },
  ];

  if (isCreator) {
    tabs.push({ 
      id: 'requests', 
      label: `Requests (${pendingCount})`, 
      icon: ShieldAlert,
      alert: pendingCount > 0 
    });
  }

  const handleTabChange = (tabId) => {
    const path = tabId === 'overview' ? `/tournaments/${id}` : `/tournaments/${id}/${tabId}`;
    navigate(path);
  };

  return (
    <>
      {/* --- HEADER --- */}
      <div className='col-start-2 col-span-10 flex flex-col pt-8 pb-0 items-center justify-center'>
        <div className='font-outfit text-primary-accent text-5xl font-extrabold text-center'>{details.name}</div>
        <div className='flex flex-wrap justify-center gap-4 mt-4 text-secondary-accent font-medium'>
          <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm">
            <MapPin size={18} className="text-txt-dark"/> {details.location}
          </span>
          <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm">
            <Clock size={18} className="text-txt-dark"/> 
            {formatDateTimeRange(details.start_date, details.end_date)}
          </span>
        </div>
      </div>

      {/* --- CONTROLS --- */}
      <div className='col-start-4 col-span-6 flex flex-col gap-4 mt-6'>
        <ViewToggle options={tabs} activeId={activeTab} onToggle={handleTabChange} />
      </div>

      <div className='col-start-2 col-span-10 px-8 pt-2'>
        <Button variant='ghost' onClick={() => navigate('/tournaments')}>← Back to List</Button>
      </div>

      {/* --- PAGE CONTENT (Outlet) --- */}
      <Outlet context={{ data, refreshData: fetchDetails, currentUser: user }} />
    </>
  );
};

export default TournamentLayout;