import React, { useState } from 'react';
import { 
  X, User, Phone, Hash, Shirt, Image as ImageIcon, 
  Palette, AlignLeft, Eye, Edit3 
} from 'lucide-react';

import { Tray, Button, InputForm, InputSelect, MarkdownForm } from '@/components';

const EditProfileModal = ({ user, onClose, onSave }) => {
  // Initialize state with existing user data
  const [formData, setFormData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    phoneNumber: user.phoneNumber || '',
    vgaNumber: user.vgaNumber || '',
    shirtSize: user.shirtSize || '',
    bio: user.bio || '',
    profilePicUrl: user.profilePicUrl || '',
    backgroundColorHex: user.backgroundColorHex || '#64748b',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isPreview, setIsPreview] = useState(false); // New state for Markdown toggle

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await onSave(formData);
    setIsLoading(false);
  };

  // Define the Header for the Tray
  const ModalHeader = (
    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
      <h2 className="text-3xl font-extrabold font-outfit text-primary-accent">Edit Profile</h2>
      <Button variant="danger" onClick={onClose}>
        <X size={22} />
      </Button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-1000 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 max-h-full overflow-y-auto">
      <Tray 
        pos="" 
        size="w-full max-w-4xl" 
        className="max-h-[90vh]" 
        title={ModalHeader}
      >
        <form onSubmit={handleSubmit} >
          <div className="grid grid-cols-2 gap-6">
            {/* Left Column: Personal Details */}
            <div className="flex flex-col gap-6">
              <h3 className="text-txt-dark font-bold font-outfit text-lg">Personal Details</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <InputForm label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} icon={User} required />
                <InputForm label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required />
              </div>
              
              <InputForm label="Phone" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} icon={Phone} required />
              
              <div className="grid grid-cols-2 gap-4">
                <InputForm label="VGA Number" name="vgaNumber" value={formData.vgaNumber} onChange={handleChange} icon={Hash} />
                <InputSelect 
                  label="Shirt Size" 
                  name="shirtSize" 
                  placeholder="Select Size"
                  value={formData.shirtSize} 
                  onChange={handleChange} 
                  options={['S', 'M', 'L', 'XL', 'XXL', 'XXXL']} 
                  icon={Shirt} 
                />
              </div>
            </div>

            {/* Right Column: Appearance & Bio */}
            <div className="flex flex-col gap-6">
              <h3 className="text-txt-dark font-bold font-outfit text-lg">Appearance & Bio</h3>
              
              <InputForm label="Avatar URL" name="profilePicUrl" value={formData.profilePicUrl} onChange={handleChange} icon={ImageIcon} />
              <div className="flex flex-col gap-2">
                  <InputForm label="Theme Color" name="backgroundColorHex" value={formData.backgroundColorHex} onChange={handleChange} icon={Palette} />
                  <input type="color" name="backgroundColorHex" value={formData.backgroundColorHex} onChange={handleChange} className="w-full h-10 cursor-pointer rounded-lg border border-gray-100" />
              </div>
            </div>
          </div>

          {/* Enhanced Bio with Markdown Preview Toggle */}
          <MarkdownForm 
            label="Bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself..."
            previewHeight="min-h-[150px] max-h-[300px]"
          />

          {/* Footer Actions */}
          <div className="col-span-full flex flex-row gap-4 mt-4 pt-4 border-t border-gray-100">
            <Button type="button" variant='ghost' onClick={onClose} className="flex-1">Cancel</Button>
            <Button type="submit" isLoading={isLoading} className="flex-1">Save Changes</Button>
          </div>
        </form>
      </Tray>
    </div>
  );
};

export default EditProfileModal;