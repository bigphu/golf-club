import React, { useState } from 'react';
import { X, User, Phone, Hash, Shirt, Image as ImageIcon, Palette, AlignLeft } from 'lucide-react';
import Tray from './Tray';
import Button from './Button'; 
import InputForm from './InputForm';
import InputSelect from './InputSelect';

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
      <Button 
        onClick={onClose} 
        variant='danger'
      >
        <X size={24} />
      </Button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-1000 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 max-h-full overflow-y-auto">
      {/* Using Tray for the container layout */}
      {/* We strip 'pos' and force a max-width. Max-height helps on small screens */}
      <Tray 
        pos="" 
        size="w-full max-w-4xl" 
        className="max-h-[90vh]" 
        title={ModalHeader}
      >
        {/* The form acts as the content inside the Tray */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 px-1">
          
          {/* Left Column */}
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

          {/* Right Column */}
          <div className="flex flex-col gap-6">
            <h3 className="text-txt-dark font-bold font-outfit text-lg">Appearance & Bio</h3>
            
            <InputForm label="Avatar URL" name="profilePicUrl" value={formData.profilePicUrl} onChange={handleChange} icon={ImageIcon} />
            <div className="flex flex-col gap-2">
                <InputForm label="Theme Color" name="backgroundColorHex" value={formData.backgroundColorHex} onChange={handleChange} icon={Palette} />
                <input type="color" name="backgroundColorHex" value={formData.backgroundColorHex} onChange={handleChange} className="w-full h-10 cursor-pointer rounded-lg border border-gray-200" />
            </div>

             {/* Bio Manual Input */}
            <InputForm 
              label="Bio" 
              name="bio" 
              type="textarea"
              value={formData.bio} 
              onChange={handleChange} 
              placeholder="Tell us about your golf experience..." 
              icon={AlignLeft} 
            />
          </div>

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