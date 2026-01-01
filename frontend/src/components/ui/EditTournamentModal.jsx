import React, { useState } from 'react';
import { X, Trophy, Type, MapPin, Calendar, Users, DollarSign, ListOrdered, Image as ImageIcon, Eye, Edit3, AlignLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Tray, Button, InputForm, InputSelect } from '@/components';

const EditTournamentModal = ({ tournament, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: tournament.name,
    description: tournament.description,
    location: tournament.location,
    // Ensure dates are formatted correctly for datetime-local input
    startDate: tournament.start_date?.replace(' ', 'T').slice(0, 16) || '', 
    endDate: tournament.end_date?.replace(' ', 'T').slice(0, 16) || '',
    maxParticipants: tournament.max_participants,
    entryFee: tournament.entry_fee,
    format: tournament.format,
    imageUrl: tournament.image_url
  });

  const [isPreview, setIsPreview] = useState(false);
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
    <div className="fixed inset-0 z-1000 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 max-h-full overflow-y-auto">
      <Tray 
        size="w-full max-w-4xl" 
        className="max-h-[95vh]" 
        title={
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-2">
            <div className="flex items-center gap-2">
              <Trophy className="text-primary-accent" />
              <h2 className="text-2xl font-bold font-outfit text-primary-accent">Edit Tournament</h2>
            </div>
              
            <div className="flex gap-2">      
              <Button variant="danger" onClick={onClose}><X size={22} /></Button>
            </div>
          </div>
        }
        
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
          {/* Metadata Section (Visible in both modes for context) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputForm label="Tournament Name" name="name" value={formData.name} onChange={handleChange} icon={Type} required />
            <InputForm label="Poster / Banner URL" name="imageUrl" value={formData.imageUrl} onChange={handleChange} icon={ImageIcon} />
          </div>

          {/* {!isPreview && ( */}
            <>
              <div className="grid grid-cols-2 gap-4">
                <InputForm label="Start Date" name="startDate" type="datetime-local" value={formData.startDate} onChange={handleChange} required icon={Calendar} />
                <InputForm label="End Date" name="endDate" type="datetime-local" value={formData.endDate} onChange={handleChange} required icon={Calendar} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InputForm label="Location/Course" name="location" value={formData.location} onChange={handleChange} icon={MapPin} required />
                <InputSelect label="Format" name="format" value={formData.format} onChange={handleChange} options={['Stroke Play', 'Match Play', 'Scramble', 'Stableford']} icon={ListOrdered} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InputForm label="Max Players" name="maxParticipants" type="number" value={formData.maxParticipants} onChange={handleChange} icon={Users} required />
                <InputForm label="Entry Fee ($)" name="entryFee" type="number" value={formData.entryFee} onChange={handleChange} icon={DollarSign} required />
              </div>
            </>
          {/* )} */}

          {/* Conditional Description Toggle */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold font-outfit text-txt-primary uppercase tracking-wider">
                {isPreview ? "Description Preview" : "Description (Markdown)"}
              </label>
              <Button 
                type="button" 
                variant="secondary" 
                size="sm" 
                onClick={() => setIsPreview(!isPreview)}
                className="flex gap-2 h-8 py-0"
                >
                {isPreview ? <Edit3 size={14} /> : <Eye size={14} />}
                <span className="text-xs">{isPreview ? "Show Editor" : "Show Preview"}</span>
              </Button>
            </div>
            
            {!isPreview ? (
              <InputForm 
                name="description" 
                type="textarea" 
                value={formData.description} 
                onChange={handleChange} 
                placeholder="## Rules..."
                icon={AlignLeft}
                required 
              />
            ) : (
              <div className="p-6 border border-gray-100 rounded-xl bg-gray-50/50 min-h-[300px] overflow-y-auto prose max-w-none font-roboto animate-fadeIn">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {formData.description || "*No description provided.*"}
                </ReactMarkdown>
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-100">
            <Button type="button" variant="ghost" onClick={onClose} className="flex-1">Cancel</Button>
            <Button type="submit" isLoading={isLoading} className="flex-1">Save Changes</Button>
          </div>
        </form>
      </Tray>
    </div>
  );
};

export default EditTournamentModal;