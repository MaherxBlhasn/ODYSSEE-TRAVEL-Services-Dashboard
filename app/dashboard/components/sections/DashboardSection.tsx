'use client';
import React, { useState, useEffect } from 'react';
import { StatsResponse } from '@/lib/types/stats.types';
import {
  Package,
  Eye,
  MessageSquare,
  Users,
  Plus,
  Mail,
  Settings,
  Clock,
  UserPlus,
  Activity,
  TrendingUp,
  Calendar,
  Star,
  ChevronRight
} from 'lucide-react';
import { statsService } from '@/lib/services/stats.service';
import { useRouter } from 'next/navigation';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, Area, AreaChart } from 'recharts';
import MetricCardSkeleton from '@/components/ui/MetricCardSkeleton';
import ChartSkeleton from '@/components/ui/ChartSkeleton';

interface DashboardProps { }

// Enhanced MetricCard component with gradient backgrounds
const MetricCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  gradient,
  iconBg
}: {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ComponentType<any>;
  gradient: string;
  iconBg: string;
}) => (
  <div className={`${gradient} rounded-2xl p-6 text-white relative overflow-hidden hover:scale-105 transition-all duration-300 shadow-lg`}>
    <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-white/10 -mr-10 -mt-10"></div>
    <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full bg-white/5 -ml-8 -mb-8"></div>
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white/80 font-medium text-sm">{title}</h3>
        <div className={`${iconBg} p-3 rounded-xl backdrop-blur-sm`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="text-3xl font-bold text-white">{value}</div>
        {subtitle && <div className="text-white/70 text-sm">{subtitle}</div>}
      </div>
    </div>
  </div>
);

// Enhanced Offers Distribution Chart
const OffersChart = ({ availableOffers, unavailableOffers }: { availableOffers: number, unavailableOffers: number }) => {
  const data = [
    { name: 'Available Offers', value: availableOffers, fill: '#10b981' },
    { name: 'Unavailable Offers', value: unavailableOffers, fill: '#f43f5e' }
  ];

  const total = availableOffers + unavailableOffers;
  const availablePercentage = total > 0 ? ((availableOffers / total) * 100).toFixed(1) : '0';
  const unavailablePercentage = total > 0 ? ((unavailableOffers / total) * 100).toFixed(1) : '0';

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Offers Distribution</h3>
        <div className="bg-emerald-100 p-2 rounded-lg">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748b' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748b' }}
            />
            <Tooltip 
              contentStyle={{
                background: '#1f2937',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
              }}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="text-center p-4 bg-emerald-50 rounded-xl">
          <div className="text-2xl font-bold text-emerald-600">{availablePercentage}%</div>
          <div className="text-sm text-emerald-700 font-medium">Available</div>
        </div>
        <div className="text-center p-4 bg-rose-50 rounded-xl">
          <div className="text-2xl font-bold text-rose-600">{unavailablePercentage}%</div>
          <div className="text-sm text-rose-700 font-medium">Unavailable</div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Activity Overview Component
const ActivityOverview = ({ totalOffers, totalMessages, totalAdmins }: { totalOffers: number, totalMessages: number, totalAdmins: number }) => {
  const data = [
    { name: 'Offers', value: totalOffers, color: '#f59e0b' },
    { name: 'Messages', value: totalMessages, color: '#3b82f6' },
    { name: 'Admins', value: totalAdmins, color: '#8b5cf6' }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Activity Overview</h3>
        <div className="bg-blue-100 p-2 rounded-lg">
          <Activity className="w-5 h-5 text-blue-600" />
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748b' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748b' }}
            />
            <Tooltip 
              contentStyle={{
                background: '#1f2937',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const DashboardSection: React.FC<DashboardProps> = () => {
  const [statsData, setStatsData] = useState<StatsResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const response = await statsService.getStats();
        if (response.success && response.data) {
          setStatsData(response.data);
          setError(null);
        } else {
          setError(response.error || 'Failed to fetch stats');
        }
      } catch {
        setError('An unexpected error occurred while fetching stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stats = {
    totalOffers: statsData?.stats.totalOffers ?? 0,
    availableOffers: statsData?.stats.availableOffers ?? 0,
    unavailableOffers: statsData?.stats.unavailableOffers ?? 0,
    totalMessages: statsData?.stats.totalMessages ?? 0,
    adminUsers: statsData?.stats.totalAdmins ?? 0,
    lastMessage: {
      date: statsData?.lastMessage?.messageSentAt ?? '',
      subject: statsData?.lastMessage?.message ?? ''
    }
  };

  const getActivityIcon = (message: string) => {
    if (message.toLowerCase().includes('offer')) return Package;
    if (message.toLowerCase().includes('message') || message.toLowerCase().includes('contact')) return MessageSquare;
    if (message.toLowerCase().includes('admin') || message.toLowerCase().includes('user')) return UserPlus;
    return Activity;
  };

  const recentActivity = statsData?.recentActivity.map((item, idx) => ({
    id: idx + 1,
    type: item.message.toLowerCase().includes('offer') ? 'offer' :
      item.message.toLowerCase().includes('message') ? 'message' : 'admin',
    description: item.message,
    timestamp: item.date,
    icon: getActivityIcon(item.message)
  })) ?? [];

  const recentMessages = statsData?.latestMessages.map((msg, idx) => ({
    id: idx + 1,
    sender: `${msg.name} ${msg.familyName}`,
    email: msg.Email,
    subject: msg.message,
    date: msg.messageSentAt,
  })) ?? [];

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'offers':
        router.push('/offers');
        break;
      case 'messages':
        router.push('/dashboard/contacts');
        break;
      case 'users':
        router.push('/dashboard/users');
        break;
      case 'analytics':
        router.push('/dashboard/analytics');
        break;
      default:
        break;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return formatDate(timestamp);
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl p-8 shadow-xl">
          <div className="text-red-500 text-lg font-semibold mb-2">Error Loading Dashboard</div>
          <div className="text-gray-600 mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-6 py-3 rounded-xl transition-all duration-300 font-medium shadow-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-6 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Track your travel agency performance and manage operations</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            <>
              <MetricCardSkeleton />
              <MetricCardSkeleton />
              <MetricCardSkeleton />
              <MetricCardSkeleton />
            </>
          ) : (
            <>
              <MetricCard
                title="Total Offers"
                value={stats.totalOffers.toLocaleString()}
                subtitle="All travel packages"
                icon={Package}
                gradient="bg-gradient-to-br from-orange-500 to-amber-500"
                iconBg="bg-white/20"
              />
              <MetricCard
                title="Available Offers"
                value={stats.availableOffers.toLocaleString()}
                subtitle={`${Math.round((stats.availableOffers / stats.totalOffers) * 100) || 0}% of total`}
                icon={Eye}
                gradient="bg-gradient-to-br from-emerald-500 to-green-500"
                iconBg="bg-white/20"
              />
              <MetricCard
                title="Total Messages"
                value={stats.totalMessages.toLocaleString()}
                subtitle="Customer inquiries"
                icon={MessageSquare}
                gradient="bg-gradient-to-br from-blue-500 to-cyan-500"
                iconBg="bg-white/20"
              />
              <MetricCard
                title="Admin Users"
                value={stats.adminUsers.toLocaleString()}
                subtitle="System administrators"
                icon={Users}
                gradient="bg-gradient-to-br from-purple-500 to-violet-500"
                iconBg="bg-white/20"
              />
            </>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => handleQuickAction('offers')}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-6 py-3 rounded-xl flex items-center gap-3 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Plus className="w-5 h-5" />
              New Offer
            </button>
            <button
              onClick={() => handleQuickAction('messages')}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 rounded-xl flex items-center gap-3 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <MessageSquare className="w-5 h-5" />
              View Messages
            </button>
            <button
              onClick={() => handleQuickAction('users')}
              className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white px-6 py-3 rounded-xl flex items-center gap-3 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Settings className="w-5 h-5" />
              Manage Admins
            </button>
            <button
              onClick={() => handleQuickAction('analytics')}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl flex items-center gap-3 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <TrendingUp className="w-5 h-5" />
              Analytics
            </button>
          </div>
        </div>

        {/* Google Analytics Card */}
        <div className="bg-gradient-to-r from-blue-600 via-green-500 to-yellow-400 rounded-2xl shadow-lg p-1">
          <div className="bg-white rounded-xl p-6 h-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-r from-blue-600 via-green-500 to-yellow-400 p-3 rounded-xl">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Google Analytics</h3>
                  <p className="text-gray-600 text-sm">Track your website performance and user behavior</p>
                </div>
              </div>
              <button
                onClick={() => handleQuickAction('analytics')}
                className="bg-gradient-to-r from-blue-600 via-green-500 to-yellow-400 hover:opacity-90 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                View Analytics
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {loading ? (
            <>
              <ChartSkeleton />
              <ChartSkeleton />
            </>
          ) : (
            <>
              <OffersChart
                availableOffers={stats.availableOffers}
                unavailableOffers={stats.unavailableOffers}
              />
              <ActivityOverview
                totalOffers={stats.totalOffers}
                totalMessages={stats.totalMessages}
                totalAdmins={stats.adminUsers}
              />
            </>
          )}
        </div>

        {/* Recent Activity & Messages Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
              <div className="bg-indigo-100 p-2 rounded-lg">
                <Activity className="w-5 h-5 text-indigo-600" />
              </div>
            </div>
            <div className="space-y-4">
              {loading ? (
                <>
                  <div className="animate-pulse flex items-start gap-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="animate-pulse flex items-start gap-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </>
              ) : (
                recentActivity.map((activity) => {
                  const IconComponent = activity.icon;
                  const getActivityStyle = (type: string) => {
                    switch (type) {
                      case 'offer': return {
                        bg: 'bg-gradient-to-br from-orange-100 to-amber-100',
                        text: 'text-orange-600',
                        border: 'border-orange-200'
                      };
                      case 'message': return {
                        bg: 'bg-gradient-to-br from-blue-100 to-cyan-100',
                        text: 'text-blue-600',
                        border: 'border-blue-200'
                      };
                      case 'admin': return {
                        bg: 'bg-gradient-to-br from-purple-100 to-violet-100',
                        text: 'text-purple-600',
                        border: 'border-purple-200'
                      };
                      default: return {
                        bg: 'bg-gradient-to-br from-gray-100 to-slate-100',
                        text: 'text-gray-600',
                        border: 'border-gray-200'
                      };
                    }
                  };

                  const style = getActivityStyle(activity.type);

                  return (
                    <div key={activity.id} className={`flex items-start gap-4 p-4 rounded-xl border ${style.border} ${style.bg} hover:shadow-md transition-all duration-300`}>
                      <div className={`p-2 rounded-lg bg-white/70 ${style.text}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 mb-1">{activity.description}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          {formatTimestamp(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Enhanced Messages Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Messages Center</h2>
              <div className="bg-rose-100 p-2 rounded-lg">
                <Mail className="w-5 h-5 text-rose-600" />
              </div>
            </div>

            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-full"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Latest Message - Special Treatment */}
                <div className="bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-2 rounded-lg">
                      <Star className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-rose-600 bg-rose-100 px-2 py-1 rounded-full">
                          LATEST MESSAGE
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(stats.lastMessage.date)}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        {truncateText(stats.lastMessage.subject, 80)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Recent Messages List */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Recent Messages</h3>
                  {recentMessages.slice(0, 3).map((message) => (
                    <div key={message.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                      <div className="bg-blue-100 p-2 rounded-lg group-hover:bg-blue-200 transition-colors">
                        <MessageSquare className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-gray-900 truncate">{message.sender}</p>
                          <span className="text-xs text-gray-500">{formatTimestamp(message.date)}</span>
                        </div>
                        <p className="text-xs text-gray-600 truncate">{truncateText(message.subject, 50)}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleQuickAction('messages')}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-4 py-3 rounded-xl transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  View All Messages
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSection;