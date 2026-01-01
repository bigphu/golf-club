import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Phone, Image as ImageIcon, Palette, Lock, AlignLeft, Hash, Shirt } from 'lucide-react';

import { api } from '../services';
import { useForm } from '../hooks';
import { Tray, Button, InputForm, InputSelect } from '../components';

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, handleChange] = useForm({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
    phone: '', vgaNumber: '', shirtSize: '', bio: '', profilePic: '', bgColor: '#64748b' 
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Validation - reset isSubmitting on early return
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setIsSubmitting(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      setIsSubmitting(false);
      return;
    }

    try {
      const { confirmPassword, ...payload } = formData;
      // Clean optional fields
      if (!payload.shirtSize) payload.shirtSize = null;
      if (!payload.vgaNumber) payload.vgaNumber = null;

      await api.post('/register', payload);
      alert("Application submitted! Please log in.");
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className='col-start-2 col-span-10 flex flex-col items-center justify-center min-h-[10vh] p-8 pb-0'>
        <div className='font-outfit text-primary-accent text-5xl font-extrabold mb-4'>Membership Application</div>
        <div className='text-secondary-accent font-medium font-roboto mt-2'>Join the club to participate in tournaments</div>
      </div>

      <Tray pos='col-start-3' size='col-span-8' className='mt-4 mb-10'>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full px-4 py-2">
          {error && <div className="col-span-full bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-200">{error}</div>}

          {/* Left Column */}
          <div className="flex flex-col gap-6">
            <h3 className="text-txt-dark font-bold font-outfit border-b border-gray-100 pb-2">Personal Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <InputForm label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Jane" icon={User} required />
              <InputForm label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Doe" required />
            </div>
            <InputForm label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="jane@example.com" icon={Mail} required />
            <InputForm label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="+1 234 567 890" icon={Phone} required />
            <div className="grid grid-cols-2 gap-4">
              <InputForm label="VGA Number" name="vgaNumber" value={formData.vgaNumber} onChange={handleChange} placeholder="VGA-1234" icon={Hash} />
              <InputSelect label="Shirt Size" name="shirtSize" value={formData.shirtSize} onChange={handleChange} options={['S', 'M', 'L', 'XL', 'XXL', 'XXXL']} placeholder="Select Size" icon={Shirt} />
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6">
            <h3 className="text-txt-dark font-bold font-outfit border-b border-gray-100 pb-2">Security & Profile</h3>
            <div className="grid grid-cols-2 gap-4">
                <InputForm label="Password" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="••••••" icon={Lock} required />
                <InputForm label="Confirm" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••" required />
            </div>
            <InputForm label="Avatar URL (Optional)" name="profilePic" value={formData.profilePic} onChange={handleChange} placeholder="https://imgur.com/..." icon={ImageIcon} />
            <InputForm label="Bio (Optional)" name="bio" type="textarea" value={formData.bio} onChange={handleChange} placeholder="Tell us about your golf experience..." icon={AlignLeft} />
            <div className="flex flex-col gap-2">
              <InputForm label="Profile Color (Hex)" name="bgColor" value={formData.bgColor} onChange={handleChange} placeholder="#64748b" icon={Palette} />
              <input type="color" name="bgColor" value={formData.bgColor} onChange={handleChange} className="w-full h-10 cursor-pointer rounded-lg border border-gray-200" />
            </div>
          </div>

          <div className="col-span-full flex flex-col gap-4 mt-4 pt-4 border-t border-gray-100">
            <Button type="submit" isLoading={isSubmitting} className="w-full">Submit Application</Button>
            <div className="text-center text-sm font-roboto text-txt-placeholder">
              Already a member? <Link to="/login" className="text-primary-accent font-bold hover:underline">Login here</Link>
            </div>
          </div>
        </form>
      </Tray>
      <div className='col-start-2 col-span-10 p-8'></div>
    </>
  );
};

export default Register;