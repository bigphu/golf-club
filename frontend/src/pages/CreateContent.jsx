import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, FileText, Layers, AlignLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

import Tray from '../components/Tray.jsx';
import InputForm from '../components/InputForm.jsx';
import InputSelect from '../components/InputSelect.jsx';
import Button from '../components/Button.jsx';

const CreateContent = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    contentType: 'NOTIFICATION', // 'NOTIFICATION' or 'DOCUMENT'
    docType: 'BCN_BYLAW', // 'BCN_BYLAW' or 'BENEFIT'
    content: '' // For Notifications
  });

  const isNotification = formData.contentType === 'NOTIFICATION';

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/content/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          type: formData.contentType,
          title: formData.title,
          content: formData.content,
          docType: formData.docType
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to create content');

      navigate('/dashboard'); // Redirects to Info Center
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className='col-start-2 col-span-10 flex flex-col min-h-[10vh] p-8 pb-0 items-center justify-center bg-transparent'>
        <div className='font-outfit text-primary-accent text-6xl font-extrabold'>
          Info Center
        </div>
        <div className='text-secondary-accent font-medium font-roboto'>
          Publish new club information
        </div>
      </div>

      <div className='col-start-2 col-span-10 flex justify-start items-end mb-4'>
        <Button variant='ghost' onClick={() => navigate(-1)}>
          ← Cancel & Return
        </Button>
      </div>

      <Tray 
        pos="col-start-3" 
        size="col-span-8" 
        variant="flex" 
        title={
          <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-2">
            <Layers className="text-primary-accent" size={24} />
            <h2 className="text-2xl font-bold font-outfit text-primary-accent">
              Content Details
            </h2>
          </div>
        }
      >
        {error && (
          <div className="p-3 mb-4 text-sm font-medium text-red-600 bg-red-50 rounded-lg border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
          
          {/* Row 1: Type Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputSelect 
              label="Content Category" 
              name="contentType" 
              value={formData.contentType} 
              onChange={handleChange} 
              options={['NOTIFICATION', 'DOCUMENT']}
              icon={isNotification ? Bell : FileText}
            />
            
            {/* Conditional Sub-type for Documents */}
            {!isNotification ? (
                <InputSelect 
                  label="Document Type" 
                  name="docType" 
                  value={formData.docType} 
                  onChange={handleChange} 
                  options={['BCN_BYLAW', 'BENEFIT']}
                  icon={Layers}
                />
            ) : (
                <div className="hidden md:block"></div> 
            )}
          </div>

          {/* Row 2: Title */}
          <InputForm 
            label="Title / Subject" 
            name="title" 
            value={formData.title} 
            onChange={handleChange} 
            placeholder={isNotification ? "e.g. Course Maintenance Alert" : "e.g. 2024 Club Constitution"} 
            required 
          />

          {/* Row 3: Content (Notification Only) */}
          {isNotification && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold font-outfit text-txt-primary uppercase tracking-wider">
                Message Body <span className="text-red-500">*</span>
              </label>
              <div className="group w-full flex items-start gap-3 py-3 px-4 rounded-xl border border-txt-dark transition-all duration-200 focus-within:ring-2 focus-within:ring-offset-2 focus-within:border-txt-placeholder focus-within:outline-none focus-within:ring-border bg-surface">
                  <div className="text-txt-dark group-focus-within:text-txt-accent mt-1">
                      <AlignLeft size={20} />
                  </div>
                  <textarea
                      name="content"
                      rows="4"
                      value={formData.content}
                      onChange={handleChange}
                      placeholder="Enter the notification message here..."
                      required
                      className="w-full bg-transparent outline-none font-medium font-roboto text-txt-primary placeholder-txt-placeholder text-base resize-none"
                  />
              </div>
            </div>
          )}

          {/* Helper Note for Documents */}
          {!isNotification && (
             <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-roboto border border-emerald-100">
                <strong>Document Upload:</strong> In this demo version, creating a document entry creates a placeholder. File upload functionality would be integrated here.
             </div>
          )}

          {/* Actions */}
          <div className="flex justify-center gap-4 pt-4 border-t border-gray-100">
            <Button 
                type="submit" 
                isLoading={isLoading} 
                className="w-full md:w-auto md:px-12"
            >
              Publish Content
            </Button>
          </div>

        </form>
      </Tray>

      <div className='col-start-2 col-span-10 p-8'></div>
    </>
  );
};

export default CreateContent;