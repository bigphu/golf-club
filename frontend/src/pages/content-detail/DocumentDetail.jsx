import React, { useState } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChevronLeft, FileText, Calendar, User, Tag, Edit, Edit3 } from 'lucide-react';
import { Tray, Button, EditContentModal, StatBox } from '@/components';
import { api } from '@/services';
import { useAuth } from '@/context';

const DocumentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { rawDocs, refreshInfo, currentUser } = useOutletContext(); //
  const [isEditing, setIsEditing] = useState(false);

  const doc = rawDocs?.find(d => d.document_id === parseInt(id));
  const isAuthor = currentUser?.id === doc?.author_id; //

  if (!doc) return <div className="text-center p-10 font-outfit">Document not found</div>;

  const handleUpdate = async (updatedData) => {
    try {
      await api.put(`/content/${id}`, { ...updatedData, type: 'DOCUMENT' }, token);
      alert("Document updated successfully!");
      await refreshInfo();
      setIsEditing(false);
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <>
      <Tray pos="col-start-2" size="col-span-10" variant="flex" className="relative">
        {isAuthor && (
          <div className="absolute top-4 right-4 z-10">
            <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)} className="flex gap-2 bg-white/80 backdrop-blur-sm border-gray-200">
              <Edit size={16} /> Edit Document
            </Button>
          </div>
        )}

        <div className="w-full animate-fadeIn">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" onClick={() => navigate('/info-center')} className="flex gap-2 text-gray-500">
              <ChevronLeft size={18} /> Back to Documents
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 flex flex-col gap-6">
              <h1 className="text-4xl md:text-5xl font-black font-outfit text-primary-accent leading-tight">{doc.title}</h1>
              <div className="prose max-w-none font-roboto bg-white p-8 rounded-3xl border border-gray-100 shadow-sm min-h-[500px]">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{doc.content}</ReactMarkdown>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-4">
              <div className="bg-gray-50/50 border border-gray-100 p-6 rounded-3xl">
                <h3 className="text-sm font-black uppercase tracking-tighter text-secondary-accent mb-4 flex items-center gap-2"><Tag size={16} /> Document Info</h3>
                <div className="grid grid-cols-1 gap-3">
                  <StatBox label="Author" value={doc.author_name} icon={User} />
                  <StatBox label="Published" value={new Date(doc.created_at).toLocaleDateString()} icon={Calendar} />
                  <StatBox label="Category" value={doc.type} icon={FileText} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Tray>

      {isEditing && (
        <EditContentModal item={doc} contentType="DOCUMENT" onClose={() => setIsEditing(false)} onSave={handleUpdate} />
      )}
    </>
  );
};

export default DocumentDetail;