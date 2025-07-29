'use client';

import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Users, UserPlus, Activity, Clock, Eye, Globe, TrendingUp, User } from 'lucide-react';
import { analyticsService } from '@/lib/services/analytics.service';
import { AnalyticsResponse } from '@/lib/types/analytics.types';
import MetricCardSkeleton from '@/components/ui/MetricCardSkeleton';
import CountryItemSkeleton from '@/components/ui/CountryItemSkeleton';
import ChartSkeleton from '@/components/ui/ChartSkeleton';
import MetricCard from '@/components/ui/MetricCard';
import EngagementOverview from '@/components/ui/EngagementOverview';
import TopCountries from '@/components/ui/TopCountries';
import UserActivitySummary from '@/components/ui/UserActivitySummary';
import CountriesBarChart from '@/components/ui/CountriesBarChart';

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg font-semibold mb-2">Error Loading Analytics</div>
          <div className="text-gray-600 mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600 mt-1">Track your travel service performance and user engagement</p>
          </div>
          
          {/* Days Filter */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Period:</label>
            <select 
              value={selectedDays}
              onChange={(e) => setSelectedDays(Number(e.target.value))}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              disabled={loading}
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
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
              <MetricCard
                title="Total Users"
                value={analyticsData!.totalUsers.toLocaleString()}
                subtitle="All time users"
                icon={Users}
                color="blue"
                bgColor="blue-100"
              />
              <MetricCard
                title="New Users"
                value={analyticsData!.newUsers.toLocaleString()}
                subtitle={`${Math.round((analyticsData!.newUsers / analyticsData!.totalUsers) * 100)}% of total`}
                icon={UserPlus}
                color="green"
                bgColor="green-100"
              />
              <MetricCard
                title="Active Users"
                value={analyticsData!.activeUsers.toLocaleString()}
                subtitle="Currently active"
                icon={Activity}
                color="orange"
                bgColor="orange-100"
              />
              <MetricCard
                title="Page Views"
                value={analyticsData!.pageViews.toLocaleString()}
                subtitle="Total views"
                icon={Eye}
                color="purple"
                bgColor="purple-100"
              />
            </>
          )}
        </div>

        {/* Engagement & Countries Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Engagement Overview */}
          {loading ? (
            <ChartSkeleton height="h-48" />
          ) : (
            <EngagementOverview 
              engagementRate={analyticsData!.engagementRate}
              averageSessionDuration={analyticsData!.averageSessionDuration}
            />
          )}

          {/* Top Countries */}
          {loading ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="h-6 bg-gray-200 rounded w-32 mb-6 animate-pulse"></div>
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
        <div className="grid grid-cols-1 gap-6">
          {/* User Activity Summary */}
          {loading ? (
            <ChartSkeleton />
          ) : (
            analyticsData && (
                  <UserActivitySummary
                  newUsers={analyticsData!.newUsers}
                  totalUsers={analyticsData!.totalUsers}
                  activeUsers={analyticsData!.activeUsers}
                  pageViews={analyticsData!.pageViews}
                />
              )
          )}

          {/* Countries Bar Chart */}
          {analyticsData?.topCountries && analyticsData.topCountries.length > 0 && (
            <CountriesBarChart
              topCountries={analyticsData!.topCountries}
              totalUsers={analyticsData!.totalUsers}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;