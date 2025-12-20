import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, FileText, Layers, AlignLeft } from 'lucide-react';

import { useAuth } from '../context';
import { api } from '../services';
import { useForm } from '../hooks';
import { Tray, Button, InputForm, InputSelect } from '../components';

const CreateContent = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, handleChange] = useForm({
    title: '', contentType: 'NOTIFICATION', docType: 'BCN_BYLAW', content: ''
  });

  const isNotification = formData.contentType === 'NOTIFICATION';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await api.post('/content/create', {
        type: formData.contentType,
        title: formData.title,
        content: formData.content,
        docType: formData.docType
      }, token);

      navigate('/info-center');
    } catch (err) { setError(err.message); } 
    finally { setIsLoading(false); }
  };

  return (
    <>
      <div className='col-start-2 col-span-10 flex flex-col min-h-[10vh] p-8 pb-0 items-center justify-center bg-transparent'>
        <div className='font-outfit text-primary-accent text-6xl font-extrabold mb-4'>Info Center</div>
        <div className='text-secondary-accent font-medium font-roboto'>Publish new club information</div>
      </div>

      <div className='col-start-2 col-span-10 flex justify-start items-end mb-4'>
        <Button variant='ghost' onClick={() => navigate(-1)}>← Cancel & Return</Button>
      </div>

      <Tray pos="col-start-3" size="col-span-8" variant="flex" title={<div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-2"><Layers className="text-primary-accent" size={24} /><h2 className="text-2xl font-bold font-outfit text-primary-accent">Content Details</h2></div>}>
        {error && <div className="p-3 mb-4 text-sm font-medium text-red-600 bg-red-50 rounded-lg border border-red-100">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputSelect label="Content Category" name="contentType" value={formData.contentType} onChange={handleChange} options={['NOTIFICATION', 'DOCUMENT']} icon={isNotification ? Bell : FileText} />
            {!isNotification ? (
                <InputSelect label="Document Type" name="docType" value={formData.docType} onChange={handleChange} options={['BCN_BYLAW', 'BENEFIT']} icon={Layers} />
            ) : (<div className="hidden md:block"></div>)}
          </div>

          <InputForm label="Title / Subject" name="title" value={formData.title} onChange={handleChange} placeholder={isNotification ? "e.g. Course Maintenance Alert" : "e.g. 2024 Club Constitution"} required />

          {isNotification && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold font-outfit text-txt-primary uppercase tracking-wider">Message Body <span className="text-red-500">*</span></label>
              <div className="group w-full flex items-start gap-3 py-3 px-4 rounded-xl border border-txt-dark transition-all duration-200 focus-within:ring-2 focus-within:ring-offset-2 focus-within:border-txt-placeholder bg-surface">
                  <div className="text-txt-dark mt-1"><AlignLeft size={20} /></div>
                  <textarea name="content" rows="4" value={formData.content} onChange={handleChange} placeholder="Enter message here..." required className="w-full bg-transparent outline-none font-medium font-roboto text-txt-primary placeholder-txt-placeholder text-base resize-none"/>
              </div>
            </div>
          )}

          {!isNotification && <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-roboto border border-emerald-100"><strong>Document Upload:</strong> Placeholder for file upload logic.</div>}

          <div className="flex justify-center gap-4 pt-4 border-t border-gray-100">
            <Button type="submit" isLoading={isLoading} className="w-full md:w-auto md:px-12">Publish Content</Button>
          </div>
        </form>
      </Tray>
      <div className='col-start-2 col-span-10 p-8'></div>
    </>
  );
};

export default CreateContent;