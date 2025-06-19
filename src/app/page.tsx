'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Vote, Shield, Users } from 'lucide-react';

export default function Home() {
  const [showButton, setShowButton] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Ballot box component
  const BallotBox = ({ delay = 0, direction = 1 }) => (
    <motion.div
      className="absolute opacity-10"
      initial={{
        x: direction === 1 ? -100 : window.innerWidth + 100,
        y: Math.random() * window.innerHeight,
      }}
      animate={{
        x: direction === 1 ? window.innerWidth + 100 : -100,
        y: Math.random() * window.innerHeight,
        rotate: [0, 360],
      }}
      transition={{
        duration: Math.random() * 20 + 15,
        repeat: Infinity,
        delay: delay,
        ease: "linear",
      }}
    >
      <div className="w-16 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg relative border border-white/20">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 w-8 h-2 bg-gray-300 rounded-sm" />
        <Vote className="w-6 h-6 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex items-center justify-center relative overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Moving ballot boxes */}
      {[...Array(12)].map((_, i) => (
        <BallotBox key={i} delay={i * 2} direction={i % 2 === 0 ? 1 : -1} />
      ))}

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-30"
            animate={{
              x: [0, Math.random() * 200 - 100],
              y: [0, Math.random() * 200 - 100],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="text-center z-10 relative">
        {/* Logo/Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: "spring", stiffness: 100 }}
          className="mb-8"
        >
          <div className="w-32 h-32 mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-2xl mb-6">
            <Vote className="w-16 h-16 text-white" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            SecureVote
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 font-light">
            Professional Digital Election System
          </p>
        </motion.div>

        {/* Feature highlights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex justify-center space-x-8 mb-12"
        >
          <div className="text-center">
            <Shield className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <p className="text-gray-300 text-sm">Secure</p>
          </div>
          <div className="text-center">
            <Vote className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <p className="text-gray-300 text-sm">Reliable</p>
          </div>
          <div className="text-center">
            <Users className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-gray-300 text-sm">Accessible</p>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: showButton ? 1 : 0, scale: showButton ? 1 : 0.8 }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          <motion.button
            onClick={() => router.push('/login')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-12 rounded-full text-xl shadow-2xl border border-white/10"
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 25px 50px rgba(59, 130, 246, 0.3)",
              borderColor: "rgba(255,255,255,0.3)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            Access Election Portal
          </motion.button>
        </motion.div>
      </div>

      {/* Corner accent elements */}
      <motion.div
        className="absolute top-10 left-10 w-24 h-24 border-2 border-blue-500/30 rounded-full"
        animate={{ rotate: 360, scale: [1, 1.1, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-20 h-20 border-2 border-purple-500/30 rounded-full"
        animate={{ rotate: -360, scale: [1, 1.2, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute top-1/4 right-20 w-16 h-16 border-2 border-green-500/30 rounded-full"
        animate={{ rotate: 180, scale: [1, 0.8, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}
