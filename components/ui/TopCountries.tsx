import React from 'react';
import { Globe } from 'lucide-react';

interface Country {
  country: string;
  users: number;
}

interface Props {
  topCountries: Country[];
  totalUsers: number;
}

const TopCountries: React.FC<Props> = ({ topCountries, totalUsers }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-semibold text-gray-900">Top Countries</h3>
      <Globe className="w-5 h-5 text-gray-400" />
    </div>
    <div className="space-y-3">
      {topCountries.map((country, index) => (
        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">{country.country.charAt(0)}</span>
            </div>
            <span className="font-medium text-gray-900">{country.country}</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm font-semibold text-gray-700">{country.users} users</span>
            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-1000" 
                style={{ width: `${(country.users / totalUsers) * 100}%` }}
              ></div>
            </div>
            <span className="text-xs text-gray-500 w-8">
              {Math.round((country.users / totalUsers) * 100)}%
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default TopCountries;
