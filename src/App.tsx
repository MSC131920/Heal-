import React, { createContext, useContext, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './lib/firebase';
import { UserProfile, UserRole } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Stethoscope, 
  User as UserIcon, 
  Calendar, 
  FileText, 
  LayoutDashboard, 
  LogOut, 
  Menu, 
  X,
  ChevronRight,
  ShieldCheck,
  Building2,
  Users
} from 'lucide-react';

// --- Auth Context ---
interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, profile: null, loading: true, isAdmin: false });

export const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const docRef = doc(db, 'users', u.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserProfile);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAdmin: profile?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
}

// --- Layout Components ---
function Navbar() {
  const { user, profile, isAdmin, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-emerald-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="bg-emerald-900 p-2 rounded-lg group-hover:bg-emerald-800 transition-colors">
                <Stethoscope className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-serif font-bold italic text-emerald-900 leading-none">
                  Heal+
                </span>
                <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-slate-400 leading-none mt-0.5">
                  Institute
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/departments" className="text-slate-500 hover:text-emerald-900 font-medium text-sm transition-colors">Departments</Link>
            <Link to="/doctors" className="text-slate-500 hover:text-emerald-900 font-medium text-sm transition-colors">Doctors</Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to={isAdmin ? "/admin" : "/dashboard"} className="flex items-center space-x-2 text-emerald-950 font-bold bg-emerald-100/50 px-5 py-2 rounded-full hover:bg-emerald-100 transition-all text-xs uppercase tracking-widest border border-emerald-200">
                  {isAdmin ? <ShieldCheck className="w-3.5 h-3.5" /> : <LayoutDashboard className="w-3.5 h-3.5" />}
                  <span>{isAdmin ? 'Admin' : 'Dashboard'}</span>
                </Link>
                <button onClick={handleLogout} className="text-slate-300 hover:text-red-600 transition-colors">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-6">
                <Link to="/login" className="text-slate-500 hover:text-emerald-900 font-medium text-sm">Login</Link>
                <Link to="/signup" className="bg-emerald-900 text-white px-7 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-emerald-800 transition-all shadow-xl shadow-emerald-900/10 active:scale-95">
                  Join Now
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-emerald-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              <Link to="/departments" className="block px-3 py-2 text-gray-600" onClick={() => setIsOpen(false)}>Departments</Link>
              <Link to="/doctors" className="block px-3 py-2 text-gray-600" onClick={() => setIsOpen(false)}>Doctors</Link>
              {user ? (
                <>
                  <Link to={isAdmin ? "/admin" : "/dashboard"} className="block px-3 py-2 text-emerald-600 font-bold" onClick={() => setIsOpen(false)}>
                    {isAdmin ? 'Admin Panel' : 'My Dashboard'}
                  </Link>
                  <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-red-600">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block px-3 py-2 text-gray-600" onClick={() => setIsOpen(false)}>Login</Link>
                  <Link to="/signup" className="block px-3 py-2 text-emerald-600 font-bold" onClick={() => setIsOpen(false)}>Sign Up</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-emerald-950 text-emerald-50 py-20 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <Stethoscope className="h-6 w-6 text-emerald-400" />
            <span className="text-2xl font-serif italic font-bold">Heal+</span>
          </div>
          <p className="text-emerald-200/60 text-sm leading-relaxed">
            Excellence in medicine. Compassion in care. Our institute provides a high-end environment for your recovery and long-term health.
          </p>
        </div>
        <div>
          <h4 className="small-caps mb-6 text-white opacity-100">Care Departments</h4>
          <ul className="space-y-3 text-emerald-200/70 text-sm">
            <li className="hover:text-white transition-colors cursor-pointer italic">Cardiology</li>
            <li className="hover:text-white transition-colors cursor-pointer italic">Neurology</li>
            <li className="hover:text-white transition-colors cursor-pointer italic">Advanced Pediatrics</li>
            <li className="hover:text-white transition-colors cursor-pointer italic">Orthopedic Surgery</li>
          </ul>
        </div>
        <div>
          <h4 className="small-caps mb-6 text-white opacity-100">Patient Resources</h4>
          <ul className="space-y-3 text-emerald-200/70 text-sm">
            <li className="hover:text-white transition-colors cursor-pointer italic"><Link to="/doctors">Find an Expert</Link></li>
            <li className="hover:text-white transition-colors cursor-pointer italic"><Link to="/departments">Wings & Facilities</Link></li>
            <li className="hover:text-white transition-colors cursor-pointer italic"><Link to="/signup">Member Enrollment</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="small-caps mb-6 text-white opacity-100">Contact Desk</h4>
          <p className="text-emerald-200/70 text-sm">123 Clinical Plaza, West End</p>
          <p className="text-emerald-200/70 text-sm font-medium mt-2">+1 (800) MED-HEAL</p>
          <p className="text-emerald-200/70 text-sm italic">concierge@healplus.com</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/10 text-center text-emerald-400/40 text-[10px] uppercase tracking-widest font-bold">
        © 2026 Heal+ Medical Institute. All rights reserved.
      </div>
    </footer>
  );
}

// --- Protected Route ---
function ProtectedRoute({ children, role }: { children: React.ReactNode, role?: UserRole }) {
  const { user, profile, loading, isAdmin } = useAuth();
  
  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
    </div>
  );
  
  if (!user) return <Navigate to="/login" />;
  if (role && profile?.role !== role) return <Navigate to="/" />;
  
  return <>{children}</>;
}

// Placeholder Pages (will implement properly in separate steps)
import Home from './pages/Home';
import Departments from './pages/Departments';
import DoctorsListing from './pages/DoctorsListing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PatientDashboard from './pages/PatientDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Booking from './pages/Booking';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/departments" element={<Departments />} />
              <Route path="/doctors" element={<DoctorsListing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              <Route path="/dashboard" element={
                <ProtectedRoute role="patient">
                  <PatientDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/admin" element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/book/:doctorId" element={
                <ProtectedRoute>
                  <Booking />
                </ProtectedRoute>
              } />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
