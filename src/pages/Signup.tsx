import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { 
  Mail, 
  Lock, 
  User, 
  Phone,
  ArrowRight,
  ShieldCheck,
  Chrome
} from 'lucide-react';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await updateProfile(user, { displayName: name });
      
      const role = email === 'mrstrangerbest12@gmail.com' ? 'admin' : 'patient';
      
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email,
        displayName: name,
        phone,
        role,
        createdAt: Date.now()
      });
      
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if user exists in FS, if not create as patient
      const role = user.email === 'mrstrangerbest12@gmail.com' ? 'admin' : 'patient';
      
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        role,
        createdAt: Date.now()
      }, { merge: true });
      
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Google Sign-In failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-ivory-50 relative overflow-hidden py-20">
      <div className="absolute top-0 left-0 w-full h-[35%] bg-emerald-950 -z-10"></div>
      <div className="absolute top-[15%] left-[5%] w-[500px] h-[500px] bg-emerald-400/10 rounded-full blur-3xl -z-10"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full bg-white rounded-[3rem] shadow-2xl shadow-emerald-950/20 p-12 border border-emerald-100"
      >
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center space-x-2 mb-8 group">
            <div className="bg-emerald-900 p-2 rounded-lg group-hover:bg-emerald-800 transition-colors">
              <ShieldCheck className="text-emerald-400 w-5 h-5" />
            </div>
            <span className="text-2xl font-serif font-bold italic text-emerald-900">Heal+</span>
          </Link>
          <h2 className="text-4xl font-serif italic text-emerald-950 mb-2">Member Enrollment</h2>
          <p className="text-slate-500 text-sm font-medium">Join our medical institute for life-long health management.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Full Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
            />
          </div>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="email"
              placeholder="Email Address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
            />
          </div>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="tel"
              placeholder="Phone Number"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-900 text-white font-bold text-xs uppercase tracking-[0.2em] py-5 rounded-full hover:bg-emerald-800 transition-all flex items-center justify-center space-x-2 shadow-xl shadow-emerald-900/20 active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Processing Enrollment...' : (
              <>
                <span>Complete Enrollment</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="relative my-10 text-center">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-slate-100 -z-10"></div>
          <span className="bg-white px-4 text-[10px] uppercase tracking-[0.2em] font-bold text-slate-300">Or Enroll Authentically Via</span>
        </div>

        <button 
          onClick={handleGoogleSignIn}
          className="w-full bg-ivory-50 border border-emerald-100 text-emerald-900 font-bold text-xs uppercase tracking-widest py-4 rounded-full hover:bg-emerald-50 transition-all flex items-center justify-center space-x-3 mb-8"
        >
          <Chrome className="w-4 h-4 text-emerald-600" />
          <span>Google Institute ID</span>
        </button>

        <p className="text-center text-slate-400 text-xs font-semibold uppercase tracking-widest">
          Already a member?{' '}
          <Link to="/login" className="text-emerald-700 hover:text-emerald-900 underline underline-offset-4">
            Sign In Here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
