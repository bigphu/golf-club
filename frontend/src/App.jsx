import React from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import './App.css';

import { AuthProvider, useAuth } from '@/context';
import { Navbar, Footer, Background, Loading } from '@/components';
import {
  Home, Login, Register, Page404, Profile,
  Tournaments, 
  TournamentLayout, TournamentOverview, TournamentRoster, TournamentRequests,
  CreateTournament, CreateContent,
  DirectoryLayout, DirectoryMembers, DirectoryEvents,
  InfoLayout, InfoDocuments, InfoNotifications,
  DocumentDetail, NotificationDetail,
  ManageRequests
} from '@/pages';

/**
 * Higher-Order Component for protecting routes.
 * Checks if a user is authenticated; redirects to login if not.
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading fullScreen text="Verifying session..." />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const MainLayout = () => {
  return (
    <div className='min-h-[125vh] w-full flex flex-col relative'>
        <Navbar />
        <Background />

        {/* Main Content Area */}
        <div className='grow w-full grid grid-cols-12 gap-8 auto-cols-max mt-[5vh] mb-[10vh]'>
          <Routes>
            {/* --- Public Routes --- */}
            <Route path='/' element={<Navigate to="/home" replace />} />
            <Route path='/home' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />

            {/* --- Protected Domain Routes --- */}
            <Route path='/directory' element={
              <ProtectedRoute>
                <DirectoryLayout />
              </ProtectedRoute>
            }>
              <Route index element={<DirectoryMembers />} />
              <Route path='members' element={<Navigate to="." replace />} />
              <Route path='events' element={<DirectoryEvents />} />
            </Route>

            <Route path='/info-center' element={
              <ProtectedRoute>
                <InfoLayout />
              </ProtectedRoute>
            }>
              <Route index element={<InfoDocuments />} />
              <Route path='documents' element={<Navigate to="." replace />} />
              <Route path='notifications' element={<InfoNotifications />} />

              <Route path='notifications/:id' element={<NotificationDetail />} />
              <Route path='documents/:id' element={<DocumentDetail />} />
            </Route>

            {/* Tournament Routes */}
            <Route path='/tournaments' element={
              <ProtectedRoute>
                <Tournaments />
              </ProtectedRoute>
            } />
            
            <Route path='/tournaments/:id' element={
              <ProtectedRoute>
                <TournamentLayout />
              </ProtectedRoute>
            }>
              {/* Index route renders the Overview by default */}
              <Route index element={<TournamentOverview />} />
              <Route path='overview' element={<Navigate to="." replace />} /> {/* Redirect duplicate path */}
              <Route path='roster' element={<TournamentRoster />} />
              <Route path='requests' element={<TournamentRequests />} />
            </Route>

            {/* --- Admin Actions --- */}
            <Route path="/create-tournament" element={
              <ProtectedRoute>
                <CreateTournament />
              </ProtectedRoute>
            } />
            
            <Route path="/create-content" element={
              <ProtectedRoute>
                <CreateContent />
              </ProtectedRoute>
            } />

            <Route path="/manage-requests" element={
              <ProtectedRoute>
                <ManageRequests />
              </ProtectedRoute>
            } />

            {/* --- Profile Routes --- */}
            <Route path='/profile' element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            
            <Route path='/profile/:userId' element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />

            {/* --- 404 Fallback --- */}
            <Route path='*' element={<Page404 />} />
          </Routes>
        </div>

        <Footer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}

export default App;