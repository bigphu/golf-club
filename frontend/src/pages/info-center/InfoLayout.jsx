import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { Layers, Bell } from 'lucide-react'; 

import { useAuth } from '@/context';
import { api } from '@/services';
import { ViewToggle, Loading } from '@/components';

const InfoLayout = () => {
  const { user, token } = useAuth(); //
  const navigate = useNavigate();
  const location = useLocation();

  const [docs, setDocs] = useState([]);
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [docsData, notifsData] = await Promise.all([
        api.get('/documents', token),
        api.get('/notifications', token)
      ]);
      setDocs(docsData);
      setNotifs(notifsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  const currentPath = location.pathname.split('/').pop();
  const activeTab = currentPath === 'info-center' ? 'documents' : currentPath;

  const handleTabChange = (id) => {
    navigate(id === 'documents' ? '/info-center' : `/info-center/${id}`);
  };

  const tabs = [
    { id: 'documents', label: `Documents (${docs.length})`, icon: Layers },
    { id: 'notifications', label: `Notifications (${notifs.length})`, icon: Bell }
  ];

  if (loading) return <Loading />;

  return (
    <>
      <div className='col-start-2 col-span-10 flex flex-col min-h-[10vh] p-8 pb-0 items-center justify-center bg-transparent '>
        <div className='font-outfit text-primary-accent text-6xl font-extrabold mb-4'>Info Center</div>
        <div className='text-secondary-accent font-medium font-roboto'>Access club information and announcements</div>
        <div className="mt-6">
          <ViewToggle options={tabs} activeId={activeTab} onToggle={handleTabChange} />
        </div>
      </div>

      {/* Passing currentUser in context for consistency with TournamentLayout */}
      <Outlet context={{ 
        rawDocs: docs, 
        rawNotifs: notifs, 
        currentUser: user, 
        refreshInfo: fetchData 
      }} />
    </>
  );
};

export default InfoLayout;