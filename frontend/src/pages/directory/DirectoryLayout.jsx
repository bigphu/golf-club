import React, { useState } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { Compass, Users, Trophy } from 'lucide-react';
import { SearchBar, ViewToggle } from '@/components';

const DirectoryLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Shared Filter State
  const [searchQuery, setSearchQuery] = useState(''); 
  const [sortBy, setSortBy] = useState('Name'); 
  const [sortDirection, setSortDirection] = useState('asc'); 

  // Determine active tab
  const currentPath = location.pathname.split('/').pop();
  const activeTab = currentPath === 'directory' ? 'members' : currentPath;

  const handleTabChange = (id) => {
    // Reset search when switching views for a clean slate
    setSearchQuery('');
    navigate(id === 'members' ? '/directory' : `/directory/${id}`);
  };

  const tabs = [
    { id: 'members', label: 'Members', icon: Users },
    { id: 'events', label: 'Events', icon: Trophy }
  ];

  return (
    <>
      <div className='col-start-2 col-span-10 flex flex-col min-h-[10vh] p-8 pb-0 items-center justify-center bg-transparent '>
        <div className='font-outfit text-primary-accent text-6xl font-extrabold mb-4'>Directory</div>
        <div className='text-secondary-accent font-medium font-roboto'>Find members and open events</div>
        
        <div className='mt-6'>
          <ViewToggle options={tabs} activeId={activeTab} onToggle={handleTabChange} />
        </div>
      </div>

      <div className='col-start-4 col-span-6 flex flex-col gap-4 mt-4'>
        {/* Shared Search Bar */}
        <SearchBar
          onSearch={setSearchQuery}
          onSortChange={setSortBy} 
          onDirectionToggle={setSortDirection}
          sortOptions={['Name']}
          defaultSearchValue={searchQuery}
          defaultSort='Name'
        />
      </div>

      {/* Pass filter state to children */}
      <Outlet context={{ searchQuery, sortBy, sortDirection }} />
    </>
  );
};

export default DirectoryLayout;