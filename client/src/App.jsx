// App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import  AuthContext  from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardLayout from './layouts/DashboardLayout';
import FeedbackDetail from './pages/FeedbackDetail';
import NotFound from './pages/NotFound';
import SelectPreferencesPage from './pages/SelectPreferences';
import ProtectRoute from './components/ProtectedRoutes';
import PublicHomePage from './pages/PublicHomePage';
import FeedPage from './pages/FeedPage';
import CreateFeedback from './pages/CreateFeedback';
import EditFeedback from './pages/EditFeedback.jsx';
import ProfilePage from './pages/ProfilePage';
import ExplorePage from './pages/ExplorePage.jsx';

export default function App() {
  const { auth } = useContext(AuthContext);
    
  return (
    <Routes>
      {/* Public landing page */}
      <Route path="/welcome" element={<PublicHomePage />} />

      {/* Root redirects based on auth */}
      <Route path="/" element={auth?.user ? <Navigate to="/feed" /> : <Navigate to="/welcome" />} />
      <Route element={<ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />} />
      {/* Auth pages */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes */}
      <Route element={<ProtectRoute />}>
        <Route path="/preferences" element={<SelectPreferencesPage />} />
        <Route element={<DashboardLayout />}>
          <Route path="/createfeedback" element={<CreateFeedback />} />
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/feedback/:id" element={<FeedbackDetail />} />
          <Route path="/editfeedback/:id" element={<EditFeedback />} />
          <Route path="/profile" element={<ProfilePage />} /> 
          <Route path="/explore" element={<ExplorePage/>}/>
        </Route>
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
