import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { List, Plus } from 'lucide-react'; 
import { useAuth } from '../context/AuthContext.jsx';
import Tray from '../components/Tray.jsx';
import SearchBar from '../components/SearchBar.jsx';
import CardTournament from '../components/CardTournament.jsx'; 
import Loading from '../components/Loading.jsx';
import Button from '../components/Button.jsx'; 

const ITEMS_PER_PAGE = 12;
const STATUS_RANK = { 'ONGOING': 3, 'UPCOMING': 2, 'FINISHED': 1, 'CANCELED': 0 };

const Tournaments = () => {
  const [tournaments, setTournaments] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const { token, user } = useAuth(); 
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('show-all'); 
  const [sortBy, setSortBy] = useState('Status'); 
  const [sortDirection, setSortDirection] = useState('desc'); 

  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        setIsLoading(true);
        // Calls get_tournaments_view behind the scenes
        const response = await fetch('http://localhost:5000/api/tournaments', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          const formatted = data.map(t => ({
             raw: {
                 tournamentId: t.tournament_id,
                 name: t.name,
                 description: t.description,
                 status: t.status,
                 location: t.location,
                 imageUrl: t.image_url
             },
             creatorName: t.creator_name,
             // Helpers for sort/search
             title: t.name,
             status: t.status
          }));
          setTournaments(formatted);
        }
      } catch (error) { console.error(error); } 
      finally { setIsLoading(false); }
    };
    if (token) fetchTournaments();
  }, [token]);

  const processedList = useMemo(() => {
    let result = [...tournaments];
    if (searchQuery && searchQuery !== 'show-all') {
        result = result.filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    result.sort((a, b) => {
        if (sortBy === 'Status') return (STATUS_RANK[b.status] || 0) - (STATUS_RANK[a.status] || 0);
        return 0;
    });
    return result;
  }, [tournaments, searchQuery, sortBy]);

  return (
    <>
      <div className='col-start-2 col-span-10 flex flex-col min-h-[10vh] p-8 pb-0 items-center justify-center bg-transparent '>
        <div className='font-outfit text-primary-accent text-6xl font-extrabold'>Tournaments</div>
        <div className='text-secondary-accent font-medium font-roboto'>Active and upcoming golf events</div>
      </div>

      <div className='col-start-4 col-span-6'>
        <SearchBar onSearch={setSearchQuery} onSortChange={setSortBy} onDirectionToggle={setSortDirection} sortOptions={['Status', 'Title']} defaultSearchValue="show-all" defaultSort="Status" />
      </div>
      
      <div className='col-start-2 col-span-10 flex justify-end items-end'>
        {isAdmin && (
          <Button variant='primary' onClick={() => navigate('/create-tournament')} className="flex items-center gap-2">
            <Plus size={18} /> New Tournament
          </Button>
        )}
      </div>

      <Tray pos='col-start-2' size='col-span-10' variant='grid' title={<div className="flex items-center gap-2 pb-4 mb-2 border-b border-gray-100"><List className="text-primary-accent" size={24} /><h2 className="text-2xl font-bold font-outfit text-primary-accent">Events</h2></div>}>
        {isLoading ? <Loading text='Loading...' /> : processedList.map((item, idx) => (
            <CardTournament 
                key={idx}
                tournament={item.raw}
                creatorName={item.creatorName}
                onAction={() => navigate(`/tournament/${item.raw.tournamentId}`)}
            />
        ))}
      </Tray>
    </>
  );
};

export default Tournaments;