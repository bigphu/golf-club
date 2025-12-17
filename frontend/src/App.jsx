import { Route, Routes, Navigate, useLocation } from 'react-router-dom'; 
import './App.css';

import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Navbar from '../src/components/Navbar.jsx';
import Footer from '../src/components/Footer.jsx';
import Background from '../src/components/Background.jsx';
import Loading from '../src/components/Loading.jsx';

// Pages
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Page404 from './pages/Page404.jsx';

// Domain Pages (Refactored from StudyBuddy)
import InfoCenter from './pages/InfoCenter.jsx'; // Replaces MySessions
import Tournaments from './pages/Tournaments.jsx'; // Replaces LinksCenter
import Directory from './pages/Directory.jsx'; // Replaces Discovery
import Profile from './pages/Profile.jsx';

// Admin Actions
import CreateTournament from './pages/CreateTournament.jsx'; // Replaces CreateCourse
import CreateContent from './pages/CreateContent.jsx'; // Replaces CreateSession

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loading fullScreen text="Verifying session..." />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  return children;
};

const MainLayout = () => {
  return (
    <div className='min-h-[125vh] w-full flex flex-col relative'>
      <Navbar />
      <Background />
      <div className='grow w-full grid grid-cols-12 gap-8 auto-cols-max'>
        <Routes>
          {/* Public */}
          <Route path='/' element={<Navigate to="/home" replace />} />
          <Route path='/home' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />

          {/* Protected Main Views */}
          <Route path='/directory' element={<ProtectedRoute><Directory /></ProtectedRoute>} />
          <Route path='/dashboard' element={<ProtectedRoute><InfoCenter /></ProtectedRoute>} />
          <Route path='/tournaments' element={<ProtectedRoute><Tournaments /></ProtectedRoute>} />
          
          {/* Legacy Redirects (Optional) */}
          <Route path='/linkscenter' element={<Navigate to="/tournaments" replace />} />
          <Route path='/discovery' element={<Navigate to="/directory" replace />} />

          {/* Admin Actions */}
          <Route path="/create-tournament" element={<ProtectedRoute><CreateTournament /></ProtectedRoute>} />
          <Route path="/create-content" element={<ProtectedRoute><CreateContent /></ProtectedRoute>} />

          {/* Details & Profile */}
          <Route path='/tournament/:id' element={<ProtectedRoute><Tournaments /></ProtectedRoute>} /> 
          <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path='/profile/:userId' element={<ProtectedRoute><Profile /></ProtectedRoute>} />

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