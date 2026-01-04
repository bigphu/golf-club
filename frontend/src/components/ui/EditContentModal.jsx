import React, { useState } from 'react';
import { X, Layers, Bell, FileText, Type, AlignLeft, Edit3, Eye } from 'lucide-react';
import { Tray, Button, InputForm, InputSelect, MarkdownForm } from '@/components';

const EditContentModal = ({ item, contentType, onClose, onSave }) => {
  const isNotification = contentType === 'NOTIFICATION'; //

  const [formData, setFormData] = useState({
    title: item.title || '',
    content: item.content || '',
    docType: item.type || 'BCN_BYLAW'
  });

  const [isPreview, setIsPreview] = useState(false); //
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await onSave(formData);
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-1000 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <Tray 
        size="w-full max-w-4xl" 
        className="max-h-[95vh]" 
        title={
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-2">
            <div className="flex items-center gap-2">
              {isNotification ? <Bell className="text-primary-accent" /> : <FileText className="text-primary-accent" />}
              <h2 className="text-2xl font-bold font-outfit text-primary-accent">Edit {isNotification ? 'Notification' : 'Document'}</h2>
            </div>
            <Button variant="danger" onClick={onClose}><X size={22} /></Button>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputForm label="Title / Subject" name="title" value={formData.title} onChange={handleChange} icon={Type} required />
            {!isNotification && (
              <InputSelect label="Category" name="docType" value={formData.docType} onChange={handleChange} options={['BCN_BYLAW', 'BENEFIT']} icon={Layers} />
            )}
          </div>

          <MarkdownForm 
            label="Content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Tell us about yourself..."
            previewHeight="min-h-[150px] max-h-[300px]"
          />

          <div className="flex gap-4 pt-4 border-t border-gray-100">
            <Button type="button" variant="ghost" onClick={onClose} className="flex-1">Cancel</Button>
            <Button type="submit" isLoading={isLoading} className="flex-1">Save Changes</Button>
          </div>
        </form>
      </Tray>
    </div>
  );
};

export default EditContentModal;