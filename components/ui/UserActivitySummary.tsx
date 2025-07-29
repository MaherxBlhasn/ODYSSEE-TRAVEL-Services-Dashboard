'use client';

import React from 'react';

interface UserActivitySummaryProps {
  newUsers: number;
  totalUsers: number;
  activeUsers: number;
  pageViews: number;
}

const UserActivitySummary: React.FC<UserActivitySummaryProps> = ({
  newUsers,
  totalUsers,
  activeUsers,
  pageViews,
}) => {
  const newUsersRate = Math.round((newUsers / totalUsers) * 100);
  const activeUsersRate = Math.round((activeUsers / totalUsers) * 100);
  const viewsPerUser = (pageViews / totalUsers).toFixed(1);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">User Activity Summary</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* New vs Total Users */}
        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
          <div className="text-3xl font-bold text-green-600 mb-2">{newUsersRate}%</div>
          <div className="text-sm text-green-700 font-medium">New Users Rate</div>
          <div className="text-xs text-green-600 mt-1">
            {newUsers} of {totalUsers} total
          </div>
        </div>

        {/* Active Users Rate */}
        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
          <div className="text-3xl font-bold text-blue-600 mb-2">{activeUsersRate}%</div>
          <div className="text-sm text-blue-700 font-medium">Activity Rate</div>
          <div className="text-xs text-blue-600 mt-1">{activeUsers} active users</div>
        </div>

        {/* Page Views per User */}
        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
          <div className="text-3xl font-bold text-purple-600 mb-2">{viewsPerUser}</div>
          <div className="text-sm text-purple-700 font-medium">Views per User</div>
          <div className="text-xs text-purple-600 mt-1">{pageViews} total views</div>
        </div>
      </div>
    </div>
  );
};

export default UserActivitySummary;
