import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Users, Trophy } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

import Tray from '../components/Tray.jsx';
import SearchBar from '../components/SearchBar.jsx';
import CardUser from '../components/CardUser.jsx';
import CardTournament from '../components/CardTournament.jsx'; 
import Pagination from '../components/Pagination.jsx';
import Loading from '../components/Loading.jsx';
import ViewToggle from '../components/ViewToggle.jsx';

const ITEMS_PER_PAGE = 12;

const VIEW_OPTIONS = [
  { id: 'members', label: 'Members', icon: Users },
  { id: 'tournaments', label: 'Events', icon: Trophy }
];

const Directory = () => {
  const [viewMode, setViewMode] = useState('members'); 
  const [data, setData] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState(''); 
  const [sortBy, setSortBy] = useState('Name'); 
  const [sortDirection, setSortDirection] = useState('asc'); 
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setData([]); 

        let endpoint = '';
        if (viewMode === 'members') {
          endpoint = 'http://localhost:5000/api/users'; 
        } else {
          endpoint = 'http://localhost:5000/api/tournaments?status=UPCOMING';
        }

        const response = await fetch(endpoint, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const result = await response.json();
          
          const formatted = result.map(item => {
            if (viewMode === 'members') {
                return {
                    // Search helper
                    searchName: `${item.first_name} ${item.last_name}`,
                    // Component Props
                    raw: {
                        userId: item.user_id,
                        firstName: item.first_name,
                        lastName: item.last_name,
                        email: item.email,
                        bio: item.bio,
                        profilePicUrl: item.profile_pic_url,
                        backgroundColorHex: item.background_color_hex
                    },
                    role: item.role
                };
            } else {
                return {
                    // Search helper
                    searchName: item.name,
                    // Component Props
                    raw: {
                        tournamentId: item.tournament_id,
                        name: item.name,
                        status: item.status,
                        description: item.description,
                        location: item.location,
                        imageUrl: item.image_url
                    },
                    creatorName: item.creator_name || 'Admin'
                };
            }
          });
          setData(formatted);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) fetchData();
  }, [token, viewMode]);

  const handleRegister = async (tournamentId) => {
    if (!window.confirm(`Register for Tournament #${tournamentId}?`)) return;
    try {
      const response = await fetch('http://localhost:5000/api/tournaments/register', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ tournamentId })
      });
      if (response.ok) {
        alert("Registered successfully!");
        setData(prev => prev.filter(c => c.raw.tournamentId !== tournamentId));
      } else {
        const err = await response.json();
        alert(`Error: ${err.error}`);
      }
    } catch (e) { console.error(e); }
  };

  const processedData = useMemo(() => {
    let result = [...data];
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(item => item.searchName.toLowerCase().includes(query));
    }
    result.sort((a, b) => {
      const valA = a.searchName.toLowerCase();
      const valB = b.searchName.toLowerCase();
      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return result;
  }, [data, searchQuery, sortDirection]);

  const totalPages = Math.ceil(processedData.length / ITEMS_PER_PAGE);
  const currentItems = processedData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <>
      <div className='col-start-2 col-span-10 flex flex-col min-h-[10vh] p-8 pb-0 items-center justify-center bg-transparent '>
        <div className='font-outfit text-primary-accent text-6xl font-extrabold'>Directory</div>
        <div className='text-secondary-accent font-medium font-roboto'>Find members and open events</div>
      </div>

      <div className='col-start-4 col-span-6 flex flex-col gap-4'>
        <ViewToggle options={VIEW_OPTIONS} activeId={viewMode} onToggle={setViewMode} />
        <SearchBar
          onSearch={setSearchQuery}
          onSortChange={setSortBy}
          onDirectionToggle={setSortDirection}
          sortOptions={['Name']}
          defaultSearchValue=""
          defaultSort='Name'
        />
      </div>

      <Tray 
        pos='col-start-2' size='col-span-10' variant='grid'
        title={
          <div className="flex items-center justify-start gap-2 w-full border-b border-gray-100 pb-4 mb-2">
            <Compass className="text-primary-accent" size={24} />
            <h2 className="text-2xl font-bold font-outfit text-primary-accent">
              {viewMode === 'members' ? 'Club Members' : 'Open Tournaments'}
            </h2>
          </div>
        }
      >
        {isLoading ? (
          <div className="col-span-full text-center py-10"><Loading text='Loading...' /></div>
        ) : currentItems.length > 0 ? (
          currentItems.map((item, idx) => (
            viewMode === 'members' ? (
                <CardUser 
                    key={idx}
                    user={item.raw}
                    role={item.role}
                    onAction={() => navigate(`/profile/${item.raw.userId}`)}
                />
            ) : (
                <CardTournament
                    key={idx}
                    tournament={item.raw}
                    creatorName={item.creatorName}
                    onAction={() => handleRegister(item.raw.tournamentId)}
                />
            )
          ))
        ) : (
          <div className="col-span-full text-center text-sm font-medium text-txt-dark py-10">No results found.</div>
        )}
      </Tray>

      {processedData.length > ITEMS_PER_PAGE && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}
    </>
  );
};

export default Directory;