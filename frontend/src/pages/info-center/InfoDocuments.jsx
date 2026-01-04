import React, { useMemo } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Layers, RefreshCcw, Plus } from 'lucide-react';
import { Tray, CardDocument, Button, RoleGuard } from '@/components';

const InfoDocuments = () => {
  // Destructured currentUser to match Tournament context pattern
  const { rawDocs, refreshInfo, currentUser } = useOutletContext(); 
  const navigate = useNavigate();

  const items = useMemo(() => {
    return rawDocs.map(item => ({
      raw: {
        documentId: item.document_id,
        title: item.title,
        type: item.type, 
        createdAt: item.created_at
      },
      authorName: item.author_name
    }));
  }, [rawDocs]);

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
              <Layers className="text-primary-accent" />
              <h2 className="text-2xl font-bold font-outfit text-primary-accent">Documents</h2>
            </div>
            <Button variant="ghost" onClick={refreshInfo}><RefreshCcw size={18} /></Button>
          </div>
        }
      >
        {items.length > 0 ? (
          items.map((item, idx) => (
            <div key={idx} className="animate-fadeIn w-full h-full">
              <CardDocument 
                doc={item.raw} 
                authorName={item.authorName}
                onAction={() => navigate(`/info-center/documents/${item.raw.documentId}`)} 
              />
            </div>
          ))
        ) : <div className="col-span-full text-center text-gray-400">No documents available.</div>}
      </Tray>
    </>
  );
};

export default InfoDocuments;