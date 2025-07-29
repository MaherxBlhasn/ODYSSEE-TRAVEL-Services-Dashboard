'use client';

import React from 'react';
import {
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

type Country = {
  country: string;
  users: number;
};

interface Props {
  topCountries: Country[];
  totalUsers: number;
}

const CountriesBarChart: React.FC<Props> = ({ topCountries, totalUsers }) => {
  const getCountryChartData = () => {
    if (!topCountries || topCountries.length === 0) return [];
    
    return topCountries.map(country => ({
      ...country,
      percentage: Math.round((country.users / totalUsers) * 100)
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Users by Country</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={getCountryChartData()}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="country"
              stroke="#6B7280"
              fontSize={12}
            />
            <YAxis
              stroke="#6B7280"
              fontSize={12}
            />
            <Tooltip
              formatter={(value: any) => [`${value} users`, 'Users']}
              contentStyle={{
                backgroundColor: '#1F2937',
                border: 'none',
                borderRadius: '8px',
                color: '#F9FAFB'
              }}
            />
            <Bar
              dataKey="users"
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CountriesBarChart;
