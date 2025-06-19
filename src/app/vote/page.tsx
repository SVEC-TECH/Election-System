'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, User, Users, Vote, LogOut, Clock } from 'lucide-react';

interface Candidate {
  id: string;
  name: string;
  party: string;
  description: string;
  imageUrl: string;
  position: string;
}

export default function VotePage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<string>('');
  const [hasVoted, setHasVoted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [votingSession, setVotingSession] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if voting session exists
    const sessionData = localStorage.getItem('votingSession');
    if (!sessionData) {
      router.push('/login');
      return;
    }
    
    const parsedSession = JSON.parse(sessionData);
    setVotingSession(parsedSession);
    
    // Load candidates
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    try {
      const response = await fetch('/api/candidates');
      if (response.ok) {
        const data = await response.json();
        setCandidates(data);
      }
    } catch (error) {
      console.error('Failed to load candidates:', error);
    }
  };

  const handleVote = async () => {
    if (!selectedCandidate || !votingSession) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          candidateId: selectedCandidate,
          votingCodeId: votingSession.votingCodeId 
        }),
      });

      if (response.ok) {
        setHasVoted(true);
        // Clear voting session after successful vote
        localStorage.removeItem('votingSession');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to cast vote');
      }
    } catch (error) {
      alert('An error occurred while voting');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('votingSession');
    router.push('/');
  };

  if (hasVoted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-center max-w-md w-full"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="w-24 h-24 bg-green-500 rounded-full mx-auto mb-6 flex items-center justify-center"
          >
            <CheckCircle className="w-12 h-12 text-white" />
          </motion.div>
          
          <h2 className="text-3xl font-bold text-white mb-4">Vote Cast Successfully!</h2>
          <p className="text-gray-300 mb-8">
            Thank you for participating in the democratic process. Your vote has been recorded securely.
          </p>
          
          <motion.button
            onClick={() => router.push('/results')}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-8 rounded-xl mr-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Results
          </motion.button>
          
          <motion.button
            onClick={handleLogout}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Logout
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 p-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 mb-6 flex justify-between items-center"
      >
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full flex items-center justify-center">
            <Vote className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Election Ballot</h1>
            <p className="text-gray-300">Welcome, {votingSession?.voterName}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-gray-300">
            <Clock className="w-5 h-5 mr-2" />
            <span>Election Active</span>
          </div>
          <motion.button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Voting Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6"
      >
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Users className="w-6 h-6 mr-2" />
          Presidential Election 2024
        </h2>
        <p className="text-gray-300">
          Select one candidate to cast your vote. Once submitted, your choice cannot be changed.
          Your vote is anonymous and secure.
        </p>
      </motion.div>

      {/* Candidates Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {candidates.map((candidate, index) => (
          <motion.div
            key={candidate.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className={`bg-white/10 backdrop-blur-lg rounded-2xl p-6 cursor-pointer transition-all duration-300 border-2 ${
              selectedCandidate === candidate.id 
                ? 'border-pink-500 bg-pink-500/20' 
                : 'border-white/20 hover:border-violet-400'
            }`}
            onClick={() => setSelectedCandidate(candidate.id)}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2">{candidate.name}</h3>
              <p className="text-pink-400 font-semibold mb-3">{candidate.party}</p>
              <p className="text-gray-300 text-sm mb-4">{candidate.description}</p>
              
              {selectedCandidate === candidate.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center justify-center text-pink-400"
                >
                  <CheckCircle className="w-6 h-6 mr-2" />
                  <span className="font-semibold">Selected</span>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Vote Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center"
      >
        <motion.button
          onClick={handleVote}
          disabled={!selectedCandidate || isLoading}
          className={`text-xl font-bold py-4 px-12 rounded-2xl transition-all duration-300 ${
            selectedCandidate && !isLoading
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
          whileHover={selectedCandidate && !isLoading ? { scale: 1.05 } : {}}
          whileTap={selectedCandidate && !isLoading ? { scale: 0.95 } : {}}
        >
          {isLoading ? (
            <div className="flex items-center">
              <motion.div
                className="w-6 h-6 border-2 border-white border-t-transparent rounded-full mr-3"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              Casting Vote...
            </div>
          ) : (
            'Cast Your Vote'
          )}
        </motion.button>
        
        {!selectedCandidate && (
          <p className="text-gray-400 mt-4">Please select a candidate to vote</p>
        )}
      </motion.div>
    </div>
  );
}

