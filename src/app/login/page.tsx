'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Terminal, Key, Shield, Eye, EyeOff, Mail } from 'lucide-react';

export default function Login() {
  const [loginType, setLoginType] = useState<'voter' | 'admin'>('voter');
  const [showPassword, setShowPassword] = useState(false);
  const [votingCode, setVotingCode] = useState('');
  const [voterName, setVoterName] = useState('');
  const [adminCredentials, setAdminCredentials] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [hackingText, setHackingText] = useState('');
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();

  // Hacking simulation effect
  useEffect(() => {
    const hackingSequence = [
      'Initializing secure connection...',
      'Scanning network protocols...',
      'Bypassing firewall...',
      'Accessing election database...',
      'Establishing encrypted tunnel...',
      'Loading authentication system...',
      'Ready for secure login.'
    ];
    
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < hackingSequence.length) {
        setHackingText(hackingSequence[currentIndex]);
        currentIndex++;
      } else {
        setShowForm(true);
        clearInterval(interval);
      }
    }, 800);

    return () => clearInterval(interval);
  }, []);

  const handleVoterLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/voting-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          code: votingCode.toUpperCase(), 
          voterName: voterName.trim() 
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('votingSession', JSON.stringify(data));
        router.push('/vote');
      } else {
        const error = await response.json();
        alert(error.message || 'Invalid voting code');
      }
    } catch (error) {
      alert('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminCredentials),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('adminSession', JSON.stringify(data));
        router.push('/admin');
      } else {
        alert('Invalid admin credentials');
      }
    } catch (error) {
      alert('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputVariants = {
    focus: {
      scale: 1.02,
      boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)",
    },
  };

  // Matrix-style text effect
  const MatrixText = ({ text, className = "" }) => (
    <motion.div
      className={`font-mono ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.1 }}
    >
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, color: '#00ff00' }}
          animate={{ opacity: 1, color: '#ffffff' }}
          transition={{ delay: i * 0.05, duration: 0.5 }}
        >
          {char}
        </motion.span>
      ))}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Matrix-style background */}
      <div className="absolute inset-0">
        <div 
          className="w-full h-full opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,255,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,255,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px',
          }}
        />
      </div>
      
      {/* Floating code snippets */}
      <div className="absolute inset-0">
        {['01001001', '11010011', '00110101', '10101010', '01110010'].map((code, i) => (
          <motion.div
            key={i}
            className="absolute text-green-400 font-mono text-sm opacity-20"
            initial={{
              x: Math.random() * window.innerWidth,
              y: -50,
            }}
            animate={{
              y: window.innerHeight + 50,
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration: Math.random() * 8 + 12,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear",
            }}
          >
            {code}
          </motion.div>
        ))}
      </div>
      
      {/* Scanning lines */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`scan-${i}`}
            className="absolute w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-30"
            initial={{ y: -2 }}
            animate={{ y: window.innerHeight + 2 }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.7,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Terminal-style main container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="bg-gray-900/95 backdrop-blur-xl rounded-2xl p-8 w-full max-w-2xl shadow-2xl border border-green-500/30 relative overflow-hidden"
      >
        {/* Terminal header */}
        <div className="flex items-center space-x-2 mb-6 pb-4 border-b border-green-500/30">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-green-400 font-mono text-sm ml-4">SecureVote Terminal v2.1</span>
        </div>
        
        {/* Loading sequence */}
        {!showForm && (
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex items-center space-x-2">
              <Terminal className="w-5 h-5 text-green-400" />
              <MatrixText text={hackingText} className="text-green-400 text-sm" />
            </div>
            <motion.div
              className="w-full h-1 bg-gray-700 rounded overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-green-400 to-cyan-400"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 5.6, ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>
        )}
        
        {/* Login form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Login type selector */}
            <div className="flex mb-6 bg-gray-800 rounded-xl p-1">
              <button
                onClick={() => setLoginType('voter')}
                className={`flex-1 py-2 px-4 rounded-lg font-mono text-sm transition-all ${
                  loginType === 'voter'
                    ? 'bg-green-500 text-black'
                    : 'text-green-400 hover:text-green-300'
                }`}
              >
                <Key className="w-4 h-4 inline mr-2" />
                VOTER LOGIN
              </button>
              <button
                onClick={() => setLoginType('admin')}
                className={`flex-1 py-2 px-4 rounded-lg font-mono text-sm transition-all ${
                  loginType === 'admin'
                    ? 'bg-red-500 text-black'
                    : 'text-red-400 hover:text-red-300'
                }`}
              >
                <Shield className="w-4 h-4 inline mr-2" />
                ADMIN ACCESS
              </button>
            </div>

            {/* Voter Login Form */}
            {loginType === 'voter' && (
              <form onSubmit={handleVoterLogin} className="space-y-4">
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="ENTER VOTING CODE"
                    value={votingCode}
                    onChange={(e) => setVotingCode(e.target.value.toUpperCase())}
                    className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-green-500/30 rounded-lg text-green-400 placeholder-green-600 focus:outline-none focus:border-green-400 font-mono tracking-wider"
                    maxLength={8}
                    required
                  />
                </div>
                <div className="relative">
                  <Terminal className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="YOUR NAME"
                    value={voterName}
                    onChange={(e) => setVoterName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-green-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-400"
                    required
                  />
                </div>
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-700 hover:to-cyan-700 text-black font-bold py-3 rounded-lg transition-all duration-300 disabled:opacity-50 font-mono"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? 'AUTHENTICATING...' : 'ACCESS BALLOT'}
                </motion.button>
              </form>
            )}

            {/* Admin Login Form */}
            {loginType === 'admin' && (
              <div className="space-y-4">
                {/* Admin Section Header */}
                <div className="text-center mb-6 p-4 bg-red-900/20 rounded-lg border border-red-500/30">
                  <div className="flex items-center justify-center mb-2">
                    <Shield className="w-6 h-6 text-red-400 mr-2" />
                    <h3 className="text-lg font-bold text-red-400 font-mono">ADMINISTRATOR PORTAL</h3>
                  </div>
                  <p className="text-xs text-red-300 font-mono">RESTRICTED ACCESS • HIGH SECURITY CLEARANCE REQUIRED</p>
                </div>
                
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-400 w-5 h-5" />
                    <input
                      type="email"
                      placeholder="ADMIN EMAIL ADDRESS"
                      value={adminCredentials.email}
                      onChange={(e) => setAdminCredentials({...adminCredentials, email: e.target.value})}
                      className="w-full pl-12 pr-4 py-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-300 placeholder-red-500 focus:outline-none focus:border-red-400 focus:bg-red-900/30 font-mono transition-all"
                      required
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-400 w-5 h-5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="SECURE PASSWORD"
                      value={adminCredentials.password}
                      onChange={(e) => setAdminCredentials({...adminCredentials, password: e.target.value})}
                      className="w-full pl-12 pr-12 py-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-300 placeholder-red-500 focus:outline-none focus:border-red-400 focus:bg-red-900/30 font-mono transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-400 hover:text-red-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  
                  {/* Admin warning */}
                  <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3 mb-4">
                    <p className="text-xs text-yellow-400 font-mono text-center">⚠️ WARNING: AUTHORIZED PERSONNEL ONLY</p>
                  </div>
                  
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-3 rounded-lg transition-all duration-300 disabled:opacity-50 font-mono text-lg shadow-lg"
                    whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(239, 68, 68, 0.3)" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <motion.div
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        VERIFYING CREDENTIALS...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Shield className="w-5 h-5 mr-2" />
                        ADMIN LOGIN
                      </div>
                    )}
                  </motion.button>
                </form>
              </div>
            )}
            
            {/* Security info */}
            <div className="mt-6 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
              <p className="text-xs text-gray-400 text-center mb-2 font-mono">🔒 SECURE AUTHENTICATION</p>
              <p className="text-xs text-gray-500 text-center">All votes are encrypted and anonymous</p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

