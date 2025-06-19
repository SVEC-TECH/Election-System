'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Trophy, Users, Vote, ArrowLeft, TrendingUp } from 'lucide-react';

interface VoteData {
  name: string;
  votes: number;
  percentage: number;
  color: string;
}

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];

export default function ResultsPage() {
  const [voteData, setVoteData] = useState<VoteData[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      const response = await fetch('/api/admin/candidates');
      if (response.ok) {
        const candidates = await response.json();
        const total = candidates.reduce((sum: number, candidate: any) => sum + candidate.votes, 0);
        setTotalVotes(total);
        
        const chartData = candidates.map((candidate: any, index: number) => ({
          name: candidate.name,
          votes: candidate.votes,
          percentage: total > 0 ? Math.round((candidate.votes / total) * 100) : 0,
          color: COLORS[index % COLORS.length]
        })).sort((a: VoteData, b: VoteData) => b.votes - a.votes);
        
        setVoteData(chartData);
      }
    } catch (error) {
      console.error('Failed to load results:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <motion.div
          className="text-white text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-16 h-16 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-xl">Loading Results...</p>
        </motion.div>
      </div>
    );
  }

  const winner = voteData[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 flex justify-between items-center"
      >
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Election Results</h1>
            <p className="text-gray-300">Live vote count - {totalVotes} total votes</p>
          </div>
        </div>
        
        <motion.button
          onClick={() => router.back()}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </motion.button>
      </motion.div>

      {/* Winner Announcement */}
      {winner && winner.votes > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-8 mb-8 text-center text-white"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center"
          >
            <Trophy className="w-10 h-10" />
          </motion.div>
          <h2 className="text-4xl font-bold mb-2">Current Leader</h2>
          <h3 className="text-2xl font-semibold mb-2">{winner.name}</h3>
          <p className="text-xl">{winner.votes} votes ({winner.percentage}%)</p>
        </motion.div>
      )}

      {/* Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Vote Distribution
          </h3>
          {totalVotes > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={voteData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="votes"
                >
                  {voteData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-300 flex items-center justify-center text-gray-400">
              <p>No votes cast yet</p>
            </div>
          )}
        </motion.div>

        {/* Detailed Results */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <Vote className="w-5 h-5 mr-2" />
            Detailed Results
          </h3>
          <div className="space-y-4">
            {voteData.map((candidate, index) => (
              <motion.div
                key={candidate.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="bg-white/5 rounded-xl p-4"
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                      {index === 0 && <Trophy className="w-5 h-5 text-yellow-500" />}
                    </div>
                    <span className="font-semibold text-white">{candidate.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold">{candidate.votes} votes</div>
                    <div className="text-gray-300">{candidate.percentage}%</div>
                  </div>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <motion.div
                    className="h-2 rounded-full"
                    style={{ backgroundColor: candidate.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${candidate.percentage}%` }}
                    transition={{ duration: 1, delay: 1 + index * 0.2 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Stats Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-6"
      >
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          <Users className="w-5 h-5 mr-2" />
          Election Statistics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">{totalVotes}</div>
            <div className="text-gray-300">Total Votes Cast</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">{voteData.length}</div>
            <div className="text-gray-300">Candidates</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">
              {totalVotes > 0 ? `${Math.round((totalVotes / 100) * 100)}%` : '0%'}
            </div>
            <div className="text-gray-300">Voter Turnout</div>
          </div>
        </div>
      </motion.div>

      {/* Live Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
        className="mt-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white text-center"
      >
        <div className="flex items-center justify-center space-x-2">
          <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
          <span className="font-semibold">Election is LIVE - Results update in real-time</span>
        </div>
      </motion.div>
    </div>
  );
}

