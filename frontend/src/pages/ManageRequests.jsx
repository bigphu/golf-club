import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, CheckCircle, RefreshCcw } from 'lucide-react';
import { api } from '@/services';
import { useAuth } from '@/context';
import { Tray, CardRequest, Button } from '@/components'; // Assuming Button is exported from components

const ManageRequests = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  // Fetch requests on mount
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await api.get('/requests', token);
      setRequests(res);
    } catch (err) {
      console.error("Failed to load requests", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusChange = async (request, newStatus) => {
    setProcessingId(request.request_id); // Use request_id for loading state
    try {
      await api.post('/requests/manage', { 
        requestId: request.request_id,
        status: newStatus 
      }, token);
      
      // Optimistic update: remove the item from the list immediately
      setRequests(prev => prev.filter(r => r.request_id !== request.request_id));
    } catch (err) { 
      alert('Action failed: ' + err.message); 
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <>
      <div className='col-start-2 col-span-10 flex flex-col min-h-[10vh] p-8 pb-0 items-center justify-center bg-transparent '>
        <div className='font-outfit text-primary-accent text-6xl font-extrabold mb-4'>Manage Requests</div>
        <div className='text-secondary-accent font-medium font-roboto'>Validate new member applications</div>
      </div>

      <Tray 
        pos="col-start-2" 
        size="col-span-10" 
        variant="grid"
        title={
          <div className="flex items-center justify-between pb-4 mb-2 border-b border-gray-100 w-full animate-fadeIn">
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-txt-primary" size={24} />
              <h2 className="text-2xl font-bold font-outfit text-txt-primary">
                New Member Applications 
                <span className="text-lg bg-gray-100 text-txt-primary px-2.5 py-0.5 rounded-full ml-3 border border-gray-200">
                  {requests.length}
                </span>
              </h2>
            </div>
            <Button variant="ghost" onClick={fetchRequests} disabled={loading}>
              <RefreshCcw size={18} className={loading ? 'animate-spin' : ''}/>
            </Button>
          </div>
        }
        >
        {loading ? (
          <div className="col-span-full py-12 text-center text-gray-400">Loading requests...</div>
        ) : requests.length > 0 ? (
          requests.map((req) => (
            <div key={req.request_id} className="w-full h-full animate-fadeIn">
              {/* Reuse CardRequest. Note: req maps to the participant prop shape expected by CardRequest */}
              <CardRequest 
                participant={req} 
                isProcessing={processingId === req.request_id}
                onViewProfile={() => navigate(`/profile/${req.user_id}`)}
                onApprove={() => handleStatusChange(req, 'APPROVED')}
                onReject={() => handleStatusChange(req, 'REJECTED')}
                />
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <CheckCircle size={40} className="text-emerald-200 mb-2"/>
            <p className="text-gray-500 font-medium font-outfit text-lg">All caught up!</p>
            <p className="text-gray-400 text-sm">No new membership applications found.</p>
          </div>
        )}
      </Tray>
    </>
  );
};

export default ManageRequests;