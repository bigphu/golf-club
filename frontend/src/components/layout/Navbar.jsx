import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Home, Compass, LayoutDashboard, Trophy, Bell, LogOut, User, ShieldAlert } from 'lucide-react';

import { useAuth } from '@/context';
import { RoleGuard } from '@/components';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const onlyLogoRoutes = ['/login', '/register'];
  const isOnlyLogo = onlyLogoRoutes.includes(location.pathname);

  const baseLinkClass = 'flex items-center gap-2 transition-colors duration-300 decoration-2 underline-offset-8 decoration-secondary-accent font-medium';
  const getLinkClass = ({ isActive }) => isActive ? `${baseLinkClass} text-txt-light underline` : `${baseLinkClass} text-txt-placeholder hover:text-txt-light`;

  // Display Label Logic
  const roleLabel = user?.role;

  return (
    // UPDATED: fixed positioning, explicit 10vh height, removed mb-auto
    <div className='sticky top-0 left-0 w-full h-[10vh] bg-primary shadow-md mb-auto z-50'>
      <nav className='mx-auto flex h-full max-w-10xl items-center justify-around px-8'>
        
        {/* Logo */}
        <div className='shrink-0'>
          <div className='text-2xl font-extrabold font-outfit text-white tracking-tight cursor-pointer select-none' onClick={() => navigate('/home')}>
            GolfClub<span className='text-secondary-accent'>.</span>
          </div>
        </div>

        {/* Navigation */}
        {!isOnlyLogo && user && (
          <div className='justify-center flex'>
            <ul className='flex items-center gap-8'>
              <li><NavLink to='/home' className={getLinkClass}><Home size={18} /><span>Home</span></NavLink></li>
              <li><NavLink to='/directory' className={getLinkClass}><Compass size={18} /><span>Directory</span></NavLink></li>
              <li><NavLink to='/info-center' className={getLinkClass}><LayoutDashboard size={18} /><span>Info Center</span></NavLink></li>
              <li><NavLink to='/tournaments' className={getLinkClass}><Trophy size={18} /><span>Tournaments</span></NavLink></li>

              <RoleGuard allowedRoles={['ADMIN']}> 
                <li><NavLink to='/manage-requests' className={getLinkClass}><ShieldAlert size={18} /><span>Manage Requests</span></NavLink></li>
              </RoleGuard>
            </ul>
          </div>
        )}

        {/* User Actions */}
        <div className='flex items-center gap-4'>
          {user ? (
            <>
              {/* <button type='button' className='text-txt-placeholder hover:text-txt-light active:text-secondary-accent'><Bell className="h-6 w-6" /></button> */}
              
              <div className='flex items-center gap-3 pl-2 pr-1 border-l border-white/10 cursor-pointer hover:opacity-80 transition-opacity group' onClick={() => navigate(`/profile`)}>
                <div className='text-right hidden lg:block'>
                  <div className='text-sm font-bold text-txt-light font-outfit leading-tight group-hover:text-secondary-accent transition-colors'>
                    {user.first_name} {user.last_name}
                  </div>
                  <div className='text-xs text-txt-placeholder font-medium capitalize'>{roleLabel}</div>
                </div>
                <div className='w-9 h-9 bg-linear-to-tr from-secondary-accent to-white/20 rounded-full flex items-center justify-center text-white font-bold shadow-sm border border-white/20 overflow-hidden'>
                  {user.profile_pic && user.profile_pic !== 'default.png' ? <img src={user.profile_pic} alt="Profile" className="w-full h-full object-cover" /> : <User size={16}/>}
                </div>
              </div>

              <button onClick={handleLogout} className='ml-2 text-txt-placeholder hover:text-red-400 transition-colors' title="Log out"><LogOut size={20} /></button>
            </>
          ) : (
            !isOnlyLogo && <div className='flex gap-4 items-center'><NavLink to="/login" className="text-txt-light font-bold hover:text-secondary-accent transition-colors">Log In</NavLink></div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;