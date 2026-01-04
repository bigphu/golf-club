import React, { useMemo } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { List, RefreshCcw, Plus } from 'lucide-react';
import { Tray, CardNotification, Button, RoleGuard } from '@/components';

const InfoNotifications = () => {
  const { rawNotifs, refreshInfo, currentUser } = useOutletContext(); //
  const navigate = useNavigate();

  const items = useMemo(() => {
    return rawNotifs.map(item => ({
      raw: {
        notificationId: item.notification_id,
        title: item.title,
        content: item.content,
        createdAt: item.created_at
      },
      authorName: item.author_name
    }));
  }, [rawNotifs]);

  return (
    <>
      <div className='col-start-2 col-span-10 flex justify-end items-end h-10'>
        <RoleGuard allowedRoles={['ADMIN']}> 
          <Button variant='primary' onClick={() => navigate(`/create-content`)} className="flex items-center gap-2 animate-fadeIn">
            <Plus size={18} /> Create Content
          </Button>
        </RoleGuard>
      </div>

      <Tray 
        pos="col-start-2" size="col-span-10" variant="grid" 
        title={
          <div className="flex items-center justify-between pb-4 mb-2 border-b border-gray-100 w-full animate-fadeIn">
            <div className="flex items-center gap-2">
              <List className="text-primary-accent" />
              <h2 className="text-2xl font-bold font-outfit text-primary-accent">Notifications</h2>
            </div>
            <Button variant="ghost" onClick={refreshInfo}><RefreshCcw size={18} /></Button>
          </div>
        }
      >
        {items.length > 0 ? (
          items.map((item, idx) => (
            <div key={idx} className="animate-fadeIn w-full h-full">
              <CardNotification 
                notification={item.raw} 
                authorName={item.authorName}
                onAction={() => navigate(`/info-center/notifications/${item.raw.notificationId}`)}
              />
            </div>
          ))
        ) : <div className="col-span-full text-center text-gray-400">No notifications.</div>}
      </Tray>
    </>
  );
};

export default InfoNotifications;