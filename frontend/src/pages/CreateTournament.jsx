import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Type, MapPin, Calendar, Users, DollarSign, ListOrdered, AlignLeft, Edit3, Eye, Image as ImageIcon } from 'lucide-react';

import { useAuth } from '../context';
import { api } from '../services';
import { useForm } from '../hooks';
import { Tray, Button, InputForm, InputSelect, MarkdownForm } from '../components';

const CreateTournament = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isPreview, setIsPreview] = useState(false);

  const [formData, handleChange] = useForm({
    name: '', description: '', location: '', startDate: '', endDate: '',
    maxParticipants: '', entryFee: '', format: 'Stroke Play', imageUrl: '' 
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!token) throw new Error("Authentication error: You are not logged in.");
      
      await api.post('/tournaments/create', formData, token);
      
      alert("Tournament Created Successfully!");
      navigate('/tournaments');
    } catch (err) { 
      setError(err.message); 
    } finally { 
      setIsLoading(false); 
    }
  };

  return (
    <>
      <div className='col-start-2 col-span-10 flex flex-col min-h-[10vh] p-8 pb-0 items-center justify-center bg-transparent '>
        <div className='font-outfit text-primary-accent text-6xl font-extrabold mb-4'>New Event</div>
        <div className='text-secondary-accent font-medium font-roboto'>Publish a new tournament</div>
      </div>

      <div className='col-start-2 col-span-10 flex justify-start items-end mb-4'>
        <Button variant='ghost' onClick={() => navigate(-1)}>← Cancel & Return</Button>
      </div>

      <Tray pos="col-start-3" size="col-span-8" variant="flex" title={<div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-2"><Trophy className="text-primary-accent"/><h2 className="text-2xl font-bold font-outfit text-primary-accent">Details</h2></div>}>
        {error && <div className="w-full p-3 mb-4 text-sm font-medium text-red-600 bg-red-50 rounded-lg border border-red-200">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
          <InputForm label="Tournament Name" name="name" value={formData.name} onChange={handleChange} placeholder="Summer Open" icon={Type} required />
          <InputForm label="Poster / Banner URL" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="https://imgur.com/..." icon={ImageIcon} />

          <div className="grid grid-cols-2 gap-4">
            <InputForm label="Start Date" name="startDate" type="datetime-local" value={formData.startDate} onChange={handleChange} required icon={Calendar} />
            <InputForm label="End Date" name="endDate" type="datetime-local" value={formData.endDate} onChange={handleChange} required icon={Calendar} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputForm label="Location/Course" name="location" value={formData.location} onChange={handleChange} placeholder="Green Valley GC" icon={MapPin} required />
            <InputSelect label="Format" name="format" value={formData.format} onChange={handleChange} options={['Stroke Play', 'Match Play', 'Scramble', 'Stableford']} icon={ListOrdered} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputForm label="Max Players" name="maxParticipants" type="number" value={formData.maxParticipants} onChange={handleChange} placeholder="72" icon={Users} required />
            <InputForm label="Entry Fee ($)" name="entryFee" type="number" value={formData.entryFee} onChange={handleChange} placeholder="50.00" icon={DollarSign} required />
          </div>

          <MarkdownForm 
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="## Rules..."
            previewHeight="min-h-[150px] max-h-[300px]"
          />

          <Button type="submit" isLoading={isLoading} className="w-full">Create Tournament</Button>
        </form>
      </Tray>
    </>
  );
};
export default CreateTournament;