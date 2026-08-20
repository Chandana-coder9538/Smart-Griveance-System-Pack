import React, { useState, useEffect } from 'react';
import { UserRole } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { WelcomePage } from './pages/WelcomePage';
import { HomePage } from './pages/HomePage';
import { SubmitPage } from './pages/SubmitPage';
import { TrackPage } from './pages/TrackPage';
import { MyComplaintsPage } from './pages/MyComplaintsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { ComplaintDetailPage } from './pages/ComplaintDetailPage';
import { Toaster, toast } from 'sonner';

export default function App() {
  // Navigation State
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  // User State
  const [userRole, setUserRole] = useState<UserRole>(() => {
    return (localStorage.getItem('spgps_user_role') as UserRole) || 'citizen';
  });
  const [userEmail, setUserEmail] = useState<string>(() => {
    return localStorage.getItem('spgps_user_email') || '2005chandanakg@gmail.com';
  });
  const [userName, setUserName] = useState<string>(() => {
    return localStorage.getItem('spgps_user_name') || 'Chandana Kumar';
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('spgps_auth') === 'true';
  });

  // Listen to browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname + window.location.search);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    setCurrentPath(path);
    window.history.pushState({}, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = (role: UserRole, email: string, name: string) => {
    setUserRole(role);
    setUserEmail(email);
    setUserName(name);
    setIsAuthenticated(true);
    localStorage.setItem('spgps_user_role', role);
    localStorage.setItem('spgps_user_email', email);
    localStorage.setItem('spgps_user_name', name);
    localStorage.setItem('spgps_auth', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('spgps_auth');
    navigate('/');
    toast.info('Signed out of Municipal Portal');
  };

  const handleToggleRole = () => {
    const nextRole: UserRole = userRole === 'admin' ? 'citizen' : 'admin';
    const nextName = nextRole === 'admin' ? 'Admin Olivia Taylor' : 'Chandana Kumar';
    const nextEmail = nextRole === 'admin' ? 'admin.triage@city.gov' : '2005chandanakg@gmail.com';

    setUserRole(nextRole);
    setUserName(nextName);
    setUserEmail(nextEmail);
    localStorage.setItem('spgps_user_role', nextRole);
    localStorage.setItem('spgps_user_name', nextName);
    localStorage.setItem('spgps_user_email', nextEmail);

    toast.success(`Switched role to: ${nextRole.toUpperCase()}`);

    // If on restricted page, redirect appropriately
    if (nextRole === 'citizen' && (currentPath === '/dashboard' || currentPath.startsWith('/complaint/'))) {
      navigate('/home');
    }
  };

  // Route Dispatcher
  const renderCurrentPage = () => {
    const pathname = currentPath.split('?')[0];

    // Welcome Page
    if (pathname === '/' || (!isAuthenticated && pathname !== '/track')) {
      return (
        <WelcomePage
          onLogin={handleLogin}
          currentUser={isAuthenticated ? { email: userEmail, name: userName, role: userRole } : null}
          onNavigate={navigate}
        />
      );
    }

    // Home Page
    if (pathname === '/home') {
      return (
        <HomePage
          onNavigate={navigate}
          userRole={userRole}
          userName={userName}
        />
      );
    }

    // Submit Grievance Page
    if (pathname === '/submit') {
      return (
        <SubmitPage
          onNavigate={navigate}
          currentUserEmail={userEmail}
          currentUserName={userName}
        />
      );
    }

    // Track Grievance Page
    if (pathname === '/track') {
      // Parse ?id= query param
      const urlParams = new URLSearchParams(currentPath.split('?')[1] || '');
      const initialId = urlParams.get('id') || '';
      return <TrackPage initialId={initialId} onNavigate={navigate} />;
    }

    // My Complaints Page (Citizen only)
    if (pathname === '/my-complaints') {
      return (
        <MyComplaintsPage
          userEmail={userEmail}
          userName={userName}
          onNavigate={navigate}
        />
      );
    }

    // Admin Dashboard Page (Admin only)
    if (pathname === '/dashboard') {
      if (userRole !== 'admin') {
        return (
          <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
            <h2 className="text-xl font-bold text-slate-100">Restricted Admin Access</h2>
            <p className="text-xs text-slate-400">
              This command center requires municipal administrative privileges.
            </p>
            <button
              onClick={handleToggleRole}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
            >
              Switch to Admin Mode
            </button>
          </div>
        );
      }
      return <AdminDashboardPage onNavigate={navigate} />;
    }

    // Complaint Detail Page (`/complaint/:id`)
    if (pathname.startsWith('/complaint/')) {
      const complaintId = pathname.replace('/complaint/', '');
      return <ComplaintDetailPage complaintId={complaintId} onNavigate={navigate} />;
    }

    // Fallback to Home
    return <HomePage onNavigate={navigate} userRole={userRole} userName={userName} />;
  };

  const isWelcome = currentPath === '/';

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Toast Notifications */}
      <Toaster position="top-right" richColors theme="dark" closeButton />

      {/* Navbar (hidden on /) */}
      {!isWelcome && (
        <Navbar
          currentPath={currentPath}
          onNavigate={navigate}
          userRole={userRole}
          userEmail={userEmail}
          userName={userName}
          onToggleRole={handleToggleRole}
          onLogout={handleLogout}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full relative z-10">
        {renderCurrentPage()}
      </main>

      {/* Footer (hidden on /) */}
      {!isWelcome && <Footer />}
    </div>
  );
}
