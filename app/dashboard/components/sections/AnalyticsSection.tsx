'use client';

import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Activity, Eye, TrendingUp, BarChart3, Clock, PieChart, LineChart} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, PieChart as RechartsPieChart, Cell, Pie, LineChart as RechartsLineChart, Line, BarChart, Bar } from 'recharts';
import { analyticsService } from '@/lib/services/analytics.service';
import { AnalyticsResponse } from '@/lib/types/analytics.types';
import MetricCardSkeleton from '@/components/ui/MetricCardSkeleton';
import CountryItemSkeleton from '@/components/ui/CountryItemSkeleton';
import ChartSkeleton from '@/components/ui/ChartSkeleton';
import TopCountries from '@/components/ui/TopCountries';
import { EnhancedMetricCard } from '@/components/ui/EnhancedMetricCard';

interface AnalyticsData {
  totalUsers: number;
  newUsers: number;
  activeUsers: number;
  engagementRate: string;
  averageSessionDuration: string;
  pageViews: number;
  topCountries: Array<{
    country: string;
    users: number;
  }>;
}


const Analytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDays, setSelectedDays] = useState(30);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);

      try {
        const response: AnalyticsResponse = await analyticsService.getAnalytics(selectedDays);

        if ('data' in response) {
          setAnalyticsData(response.data);
        } else {
          setError(response.error || 'Failed to fetch analytics data');
        }
      } catch (err) {
        setError('An unexpected error occurred');
        console.error('Analytics fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [selectedDays]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl p-8 shadow-xl">
          <div className="text-red-500 text-lg font-semibold mb-2">Error Loading Analytics</div>
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
            <div className="flex items-center gap-3 mb-2">
              {/* <div className="bg-gradient-to-r from-blue-600 via-green-500 to-yellow-400 p-2 rounded-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div> */}
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Analytics
              </h1>
            </div>
            <p className="text-gray-600">Track your travel service performance and user engagement with Google Analytics</p>
          </div>

          {/* Days Filter */}
          <div className="mt-4 md:mt-0">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-1">
              <div className="flex items-center gap-3 px-3 py-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <label className="text-sm font-medium text-gray-700">Period:</label>
                <div className="relative">
                  <select
                    value={selectedDays}
                    onChange={(e) => setSelectedDays(Number(e.target.value))}
                    className="appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2 pr-8 text-sm font-medium text-gray-900 cursor-pointer hover:border-gray-300"
                    disabled={loading}
                  >
                    <option value={7}>Last 7 days</option>
                    <option value={30}>Last 30 days</option>
                    <option value={90}>Last 90 days</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Google Analytics Branding */}
        <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-2xl shadow-lg p-1">
          <div className="bg-white rounded-xl p-4 h-full">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 p-3 rounded-xl">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Powered by Google Analytics</h2>
                <p className="text-gray-600 text-sm">Real-time insights into your website performance</p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            <>
              <MetricCardSkeleton />
              <MetricCardSkeleton />
              <MetricCardSkeleton />
              <MetricCardSkeleton />
            </>
          ) : (
            <>
              <EnhancedMetricCard
                title="Total Users"
                value={analyticsData!.totalUsers.toLocaleString()}
                subtitle="All time users"
                icon={Users}
                gradient="bg-gradient-to-br from-blue-500 to-cyan-500"
                iconBg="bg-white/20"
              />
              <EnhancedMetricCard
                title="New Users"
                value={analyticsData!.newUsers.toLocaleString()}
                subtitle={`${Math.round((analyticsData!.newUsers / analyticsData!.totalUsers) * 100)}% of total`}
                icon={UserPlus}
                gradient="bg-gradient-to-br from-emerald-500 to-green-500"
                iconBg="bg-white/20"
              />
              <EnhancedMetricCard
                title="Active Users"
                value={analyticsData!.activeUsers.toLocaleString()}
                subtitle="Currently active"
                icon={Activity}
                gradient="bg-gradient-to-br from-orange-500 to-amber-500"
                iconBg="bg-white/20"
              />
              <EnhancedMetricCard
                title="Page Views"
                value={analyticsData!.pageViews.toLocaleString()}
                subtitle="Total views"
                icon={Eye}
                gradient="bg-gradient-to-br from-purple-500 to-violet-500"
                iconBg="bg-white/20"
              />
            </>
          )}
        </div>

        {/* Engagement & Countries Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Enhanced Engagement Overview */}
          {loading ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
                <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
              <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Engagement Overview</h3>
                <div className="bg-rose-100 p-2 rounded-lg">
                  <Activity className="w-5 h-5 text-rose-600" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-4 border border-rose-200">
                  <div className="text-2xl font-bold text-rose-600">{analyticsData!.engagementRate}</div>
                  <div className="text-sm text-rose-700 font-medium">Engagement Rate</div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600">{analyticsData!.averageSessionDuration}</div>
                  <div className="text-sm text-blue-700 font-medium">Avg. Session Duration</div>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Top Countries */}
          {loading ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
                <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
              <div className="space-y-3">
                <CountryItemSkeleton />
                <CountryItemSkeleton />
                <CountryItemSkeleton />
              </div>
            </div>
          ) : (
            <TopCountries
              topCountries={analyticsData!.topCountries}
              totalUsers={analyticsData!.totalUsers}
            />
          )}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Growth Trend */}
          {loading ? (
            <ChartSkeleton />
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">User Growth Trend</h3>
                <div className="bg-blue-100 p-2 rounded-lg">
                  <LineChart className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={[
                    { name: 'Week 1', users: Math.floor(analyticsData!.totalUsers * 0.3), newUsers: Math.floor(analyticsData!.newUsers * 0.2) },
                    { name: 'Week 2', users: Math.floor(analyticsData!.totalUsers * 0.5), newUsers: Math.floor(analyticsData!.newUsers * 0.4) },
                    { name: 'Week 3', users: Math.floor(analyticsData!.totalUsers * 0.75), newUsers: Math.floor(analyticsData!.newUsers * 0.7) },
                    { name: 'Week 4', users: analyticsData!.totalUsers, newUsers: analyticsData!.newUsers }
                  ]} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <Tooltip contentStyle={{
                      background: '#1f2937',
                      border: 'none',
                      borderRadius: '12px',
                      color: 'white',
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                    }} />
                    <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }} />
                    <Line type="monotone" dataKey="newUsers" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }} />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-gray-600">Total Users</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-sm text-gray-600">New Users</span>
                </div>
              </div>
            </div>
          )}

          {/* User Distribution Pie Chart */}
          {loading ? (
            <ChartSkeleton />
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">User Distribution</h3>
                <div className="bg-purple-100 p-2 rounded-lg">
                  <PieChart className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={[
                        { name: 'New Users', value: analyticsData!.newUsers, fill: '#10b981' },
                        { name: 'Returning Users', value: analyticsData!.totalUsers - analyticsData!.newUsers, fill: '#3b82f6' },
                        { name: 'Active Users', value: analyticsData!.activeUsers, fill: '#f59e0b' }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent = 0 }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      <Cell fill="#10b981" />
                      <Cell fill="#3b82f6" />
                      <Cell fill="#f59e0b" />
                    </Pie>
                    <Tooltip contentStyle={{
                      background: '#1f2937',
                      border: 'none',
                      borderRadius: '12px',
                      color: 'white',
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                    }} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* Additional Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Page Views Trend */}
          {loading ? (
            <ChartSkeleton />
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Page Views Trend</h3>
                <div className="bg-rose-100 p-2 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-rose-600" />
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[
                    { day: 'Mon', views: Math.floor(analyticsData!.pageViews * 0.12) },
                    { day: 'Tue', views: Math.floor(analyticsData!.pageViews * 0.15) },
                    { day: 'Wed', views: Math.floor(analyticsData!.pageViews * 0.18) },
                    { day: 'Thu', views: Math.floor(analyticsData!.pageViews * 0.14) },
                    { day: 'Fri', views: Math.floor(analyticsData!.pageViews * 0.16) },
                    { day: 'Sat', views: Math.floor(analyticsData!.pageViews * 0.13) },
                    { day: 'Sun', views: Math.floor(analyticsData!.pageViews * 0.12) }
                  ]} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <Tooltip contentStyle={{
                      background: '#1f2937',
                      border: 'none',
                      borderRadius: '12px',
                      color: 'white',
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                    }} />
                    <Area
                      type="monotone"
                      dataKey="views"
                      stroke="#f43f5e"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorViews)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Countries Performance Bar Chart */}
          {loading ? (
            <ChartSkeleton />
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Countries Performance</h3>
                <div className="bg-amber-100 p-2 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-amber-600" />
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData!.topCountries.map((country, index) => ({
                    ...country,
                    fill: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#f43f5e'][index % 5]
                  }))} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="country" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <Tooltip contentStyle={{
                      background: '#1f2937',
                      border: 'none',
                      borderRadius: '12px',
                      color: 'white',
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                    }} />
                    <Bar dataKey="users" radius={[8, 8, 0, 0]}>
                      {analyticsData!.topCountries.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#f43f5e'][index % 5]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* User Activity Timeline */}
        <div className="grid grid-cols-1 gap-6">
          {loading ? (
            <ChartSkeleton />
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">User Activity Timeline</h3>
                <div className="bg-indigo-100 p-2 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[
                    { time: '00:00', totalUsers: Math.floor(analyticsData!.totalUsers * 0.1), activeUsers: Math.floor(analyticsData!.activeUsers * 0.05), pageViews: Math.floor(analyticsData!.pageViews * 0.08) },
                    { time: '04:00', totalUsers: Math.floor(analyticsData!.totalUsers * 0.15), activeUsers: Math.floor(analyticsData!.activeUsers * 0.1), pageViews: Math.floor(analyticsData!.pageViews * 0.12) },
                    { time: '08:00', totalUsers: Math.floor(analyticsData!.totalUsers * 0.4), activeUsers: Math.floor(analyticsData!.activeUsers * 0.35), pageViews: Math.floor(analyticsData!.pageViews * 0.3) },
                    { time: '12:00', totalUsers: Math.floor(analyticsData!.totalUsers * 0.8), activeUsers: Math.floor(analyticsData!.activeUsers * 0.7), pageViews: Math.floor(analyticsData!.pageViews * 0.6) },
                    { time: '16:00', totalUsers: analyticsData!.totalUsers, activeUsers: analyticsData!.activeUsers, pageViews: Math.floor(analyticsData!.pageViews * 0.8) },
                    { time: '20:00', totalUsers: Math.floor(analyticsData!.totalUsers * 0.6), activeUsers: Math.floor(analyticsData!.activeUsers * 0.5), pageViews: analyticsData!.pageViews },
                    { time: '23:59', totalUsers: Math.floor(analyticsData!.totalUsers * 0.2), activeUsers: Math.floor(analyticsData!.activeUsers * 0.15), pageViews: Math.floor(analyticsData!.pageViews * 0.25) }
                  ]} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="totalUsersGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="activeUsersGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="pageViewsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <Tooltip contentStyle={{
                      background: '#1f2937',
                      border: 'none',
                      borderRadius: '12px',
                      color: 'white',
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                    }} />
                    <Area
                      type="monotone"
                      dataKey="totalUsers"
                      stackId="1"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#totalUsersGradient)"
                    />
                    <Area
                      type="monotone"
                      dataKey="activeUsers"
                      stackId="2"
                      stroke="#10b981"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#activeUsersGradient)"
                    />
                    <Area
                      type="monotone"
                      dataKey="pageViews"
                      stackId="3"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#pageViewsGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-gray-600">Total Users</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-sm text-gray-600">Active Users</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span className="text-sm text-gray-600">Page Views</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Additional Analytics Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-500 p-2 rounded-lg">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-gray-900">User Growth</h3>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {analyticsData ? `+${((analyticsData.newUsers / analyticsData.totalUsers) * 100).toFixed(1)}%` : '0%'}
            </div>
            <p className="text-blue-700 text-sm">New user acquisition rate</p>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-emerald-500 p-2 rounded-lg">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-gray-900">Activity Rate</h3>
            </div>
            <div className="text-2xl font-bold text-emerald-600">
              {analyticsData ? `${((analyticsData.activeUsers / analyticsData.totalUsers) * 100).toFixed(1)}%` : '0%'}
            </div>
            <p className="text-emerald-700 text-sm">Users currently active</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-500 p-2 rounded-lg">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-gray-900">Engagement</h3>
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {analyticsData ? analyticsData.engagementRate : '0%'}
            </div>
            <p className="text-purple-700 text-sm">Overall engagement rate</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;