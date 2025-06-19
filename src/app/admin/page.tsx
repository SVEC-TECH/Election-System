'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  Users, Vote, TrendingUp, Settings, LogOut, Plus, 
  Edit, Trash2, Eye, Crown, UserCheck 
} from 'lucide-react';

interface Candidate {
  id: string;
  name: string;
  party: string;
  description: string;
  votes: number;
}

interface VoteData {
  name: string;
  votes: number;
  percentage: number;
  color: string;
}

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];

export default function AdminPanel() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [voteData, setVoteData] = useState<VoteData[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [totalVotingCodes, setTotalVotingCodes] = useState(0);
  const [usedCodes, setUsedCodes] = useState(0);
  const [participationRate, setParticipationRate] = useState('0');
  const [admin, setAdmin] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const router = useRouter();

  useEffect(() => {
    // Check if admin is logged in
    const adminData = localStorage.getItem('adminSession');
    if (!adminData) {
      router.push('/login');
      return;
    }
    
    const parsedAdmin = JSON.parse(adminData);
    if (!parsedAdmin.admin || parsedAdmin.admin.role !== 'ADMIN') {
      router.push('/login');
      return;
    }
    
    setAdmin(parsedAdmin.admin);
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load candidates with vote counts
      const candidatesResponse = await fetch('/api/admin/candidates');
      if (candidatesResponse.ok) {
        const candidatesData = await candidatesResponse.json();
        setCandidates(candidatesData);
        
        const total = candidatesData.reduce((sum: number, candidate: Candidate) => sum + candidate.votes, 0);
        setTotalVotes(total);
        
        const chartData = candidatesData.map((candidate: Candidate, index: number) => ({
          name: candidate.name,
          votes: candidate.votes,
          percentage: total > 0 ? Math.round((candidate.votes / total) * 100) : 0,
          color: COLORS[index % COLORS.length]
        }));
        setVoteData(chartData);
      }

      // Load voting code statistics
      const usersResponse = await fetch('/api/admin/users');
      if (usersResponse.ok) {
        const votingData = await usersResponse.json();
        setTotalVotingCodes(votingData.statistics.totalCodes);
        setUsedCodes(votingData.statistics.usedCodes);
        setParticipationRate(votingData.statistics.participationRate);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    router.push('/');
  };

  const StatCard = ({ title, value, icon: Icon, color, gradient }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className={`bg-gradient-to-r ${gradient} rounded-2xl p-6 text-white shadow-lg`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className={`w-12 h-12 bg-white/20 rounded-full flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  );

  const PercentageBar = ({ candidate, index }: { candidate: VoteData; index: number }) => (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white/10 backdrop-blur-lg rounded-xl p-4 mb-4"
    >
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold text-white">{candidate.name}</span>
        <span className="text-gray-300">{candidate.votes} votes ({candidate.percentage}%)</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-3">
        <motion.div
          className="h-3 rounded-full"
          style={{ backgroundColor: candidate.color }}
          initial={{ width: 0 }}
          animate={{ width: `${candidate.percentage}%` }}
          transition={{ duration: 1, delay: index * 0.2 }}
        />
      </div>
    </motion.div>
  );

  if (activeTab === 'dashboard') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 flex justify-between items-center"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-gray-300">Welcome back, {admin?.name}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={() => setActiveTab('candidates')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <Settings className="w-4 h-4" />
              <span>Manage</span>
            </motion.button>
            <motion.button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Votes"
            value={totalVotes}
            icon={Vote}
            gradient="from-pink-500 to-rose-500"
          />
          <StatCard
            title="Voting Codes Used"
            value={`${usedCodes}/${totalVotingCodes}`}
            icon={Users}
            gradient="from-blue-500 to-cyan-500"
          />
          <StatCard
            title="Candidates"
            value={candidates.length}
            icon={UserCheck}
            gradient="from-green-500 to-emerald-500"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pie Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6"
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Vote Distribution
            </h3>
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
          </motion.div>

          {/* Bar Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6"
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <BarChart className="w-5 h-5 mr-2" />
              Vote Count
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={voteData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="name" stroke="#ffffff80" />
                <YAxis stroke="#ffffff80" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#ffffff'
                  }} 
                />
                <Bar dataKey="votes" fill="#8884d8">
                  {voteData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Percentage Bars */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 bg-white/10 backdrop-blur-lg rounded-2xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-6">Candidate Performance</h3>
          {voteData.map((candidate, index) => (
            <PercentageBar key={candidate.name} candidate={candidate} index={index} />
          ))}
        </motion.div>

        {/* Real-time Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">Election Status</h3>
              <p className="text-green-100">Live voting is currently active</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
              <span className="font-semibold">LIVE</span>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Candidate Management Tab (placeholder)
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Candidate Management</h2>
        <p className="text-gray-300 mb-6">This section would allow adding, editing, and removing candidates.</p>
        <motion.button
          onClick={() => setActiveTab('dashboard')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg"
          whileHover={{ scale: 1.05 }}
        >
          Back to Dashboard
        </motion.button>
      </div>
    </div>
  );
}

