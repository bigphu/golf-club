import React from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { Layers, Bell, Plus } from 'lucide-react'; 

import { useAuth } from '@/context';
import { Button, ViewToggle, RoleGuard } from '@/components';

const InfoLayout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active tab
  const currentPath = location.pathname.split('/').pop();
  const activeTab = currentPath === 'info-center' ? 'documents' : currentPath;

  const handleTabChange = (id) => {
    navigate(id === 'documents' ? '/info-center' : `/info-center/${id}`);
  };

  const tabs = [
    { id: 'documents', label: 'Documents', icon: Layers },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  return (
    <>
      <div className='col-start-2 col-span-10 flex flex-col min-h-[10vh] p-8 pb-0 items-center justify-center bg-transparent '>
        <div className='font-outfit text-primary-accent text-6xl font-extrabold mb-4'>Info Center</div>
        <div className='text-secondary-accent font-medium font-roboto'>Access club information and announcements</div>
        <div className="mt-6">
          <ViewToggle options={tabs} activeId={activeTab} onToggle={handleTabChange} />
        </div>
      </div>

      {/* Admin Action Button - Context Aware */}
      <div className='col-start-2 col-span-10 flex justify-end items-end h-10'>
        <RoleGuard allowedRoles={['ADMIN']}> 
          <Button variant='primary' onClick={() => navigate(`/create-content`)} className="flex items-center gap-2 animate-fadeIn">
            <Plus size={18} /> Create {activeTab === 'documents' ? 'Doc' : 'Notif'}
          </Button>
        </RoleGuard>
      </div>

      {/* Page Content */}
      <Outlet />
    </>
  );
};

export default InfoLayout;