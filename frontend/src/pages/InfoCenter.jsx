import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, List, Plus } from 'lucide-react'; 
import { useAuth } from '../context/AuthContext.jsx';
import Tray from '../components/Tray.jsx';
import CardDocument from '../components/CardDocument.jsx';
import CardNotification from '../components/CardNotification.jsx';
import Loading from '../components/Loading.jsx';
import Button from '../components/Button.jsx';
import ViewToggle from '../components/ViewToggle.jsx'; 

const InfoCenter = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('documents');
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setIsLoading(true);
        const endpoint = viewMode === 'documents' ? 'api/documents' : 'api/notifications';
        const response = await fetch(`http://localhost:5000/${endpoint}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        const formatted = data.map(item => {
            if (viewMode === 'documents') {
                return {
                    raw: {
                        documentId: item.document_id,
                        title: item.title,
                        type: item.type, // 'BCN_BYLAW' or 'BENEFIT'
                        createdAt: item.created_at
                    },
                    authorName: item.author_name
                };
            } else {
                return {
                    raw: {
                        notificationId: item.notification_id,
                        title: item.title,
                        content: item.content,
                        createdAt: item.created_at
                    },
                    authorName: item.author_name
                };
            }
        });
        setItems(formatted);
      } catch (err) { console.error(err); } finally { setIsLoading(false); }
    };
    if (token) fetchContent();
  }, [token, viewMode]);

  return (
    <>
      <div className='col-start-2 col-span-10 flex flex-col min-h-[10vh] p-8 pb-0 items-center justify-center bg-transparent '>
        <div className='font-outfit text-primary-accent text-6xl font-extrabold'>Info Center</div>
        <div className="mt-6">
          <ViewToggle options={[{ id: 'documents', label: 'Documents', icon: Layers }, { id: 'notifications', label: 'Notifications', icon: List }]} activeId={viewMode} onToggle={setViewMode} />
        </div>
      </div>

      <div className='col-start-2 col-span-10 flex justify-end items-end'>
        {isAdmin && (
          <Button variant='primary' onClick={() => navigate(`/create-content`)} className="flex items-center gap-2">
            <Plus size={18} /> Create {viewMode === 'documents' ? 'Doc' : 'Notif'}
          </Button>
        )}
      </div>

      <Tray pos="col-start-2" size="col-span-10" variant="grid" title={<div className="flex items-center gap-2 pb-4 mb-2 border-b border-gray-100"><Layers className="text-primary-accent" /><h2 className="text-2xl font-bold font-outfit text-primary-accent">{viewMode}</h2></div>}>
        {isLoading ? <Loading /> : items.map((item, idx) => (
            viewMode === 'documents' ? (
                <CardDocument 
                    key={idx} 
                    doc={item.raw} 
                    authorName={item.authorName}
                    onAction={() => alert(`View doc ${item.raw.documentId}`)} 
                />
            ) : (
                <CardNotification 
                    key={idx} 
                    notification={item.raw} 
                    authorName={item.authorName}
                    onAction={() => alert(`Mark read ${item.raw.notificationId}`)} 
                />
            )
        ))}
      </Tray>
    </>
  );
};

export default InfoCenter;