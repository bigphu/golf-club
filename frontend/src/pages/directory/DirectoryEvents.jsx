import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Trophy, RefreshCcw } from 'lucide-react';

import { useAuth } from '@/context';
import { api } from '@/services';
import { useDataFilter } from '@/hooks';
import { Tray, CardTournament, Loading, Pagination, Button } from '@/components';

const ITEMS_PER_PAGE = 12;

const DirectoryEvents = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { searchQuery, sortBy, sortDirection } = useOutletContext();

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const result = await api.get('/tournaments?status=UPCOMING', token);
      const formatted = result.map(item => ({
          name: item.name,
          raw: {
              tournamentId: item.tournament_id,
              name: item.name,
              status: item.status,
              description: item.description,
              location: item.location,
              imageUrl: item.image_url,
              startDate: item.start_date,
              endDate: item.end_date
          },
          creatorName: item.creator_name || 'Admin'
      }));
      setData(formatted);
    } catch (error) { console.error(error); } 
    finally { setIsLoading(false); }
  };

  useEffect(() => {
    if (token) fetchEvents();
  }, [token]);

  const processedData = useDataFilter(data, { searchQuery, sortBy, sortDirection }, { 
      searchKeys: ['name'],
      sortStrategies: { 'Name': (a, b) => a.name.localeCompare(b.name) }
  });

  const totalPages = Math.ceil(processedData.length / ITEMS_PER_PAGE);
  const currentItems = processedData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <>
      <Tray 
        pos='col-start-2' size='col-span-10' variant='grid'
        title={
          <div className="flex items-center justify-between w-full border-b border-gray-100 pb-4 mb-2 animate-fadeIn">
            <div className="flex items-center gap-2">
                <Trophy className="text-primary-accent" size={24} />
                <h2 className="text-2xl font-bold font-outfit text-primary-accent">
                    Open Tournaments
                    <span className="text-lg bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full ml-3 border border-gray-200">
                        {processedData.length}
                    </span>
                </h2>
            </div>
            <Button variant="ghost" onClick={fetchEvents} disabled={isLoading}>
                <RefreshCcw size={18} className={isLoading ? 'animate-spin' : ''}/>
            </Button>
          </div>
        }
      >
        {isLoading ? <div className="col-span-full py-10"><Loading /></div> : 
        currentItems.length > 0 ? (
          currentItems.map((item, idx) => (
            <div key={idx} className="w-full h-full animate-fadeIn">
                <CardTournament
                    tournament={item.raw}
                    creatorName={item.creatorName}
                    onAction={() => navigate(`/tournaments/${item.raw.tournamentId}`)}
                />
            </div>
          ))
        ) : <div className="col-span-full text-center py-10 text-gray-400">No upcoming events found.</div>}
      </Tray>

      {processedData.length > ITEMS_PER_PAGE && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}
    </>
  );
};

export default DirectoryEvents;