import React, { useState } from 'react';
import { Globe, ChevronDown, ChevronUp } from 'lucide-react';
import ReactCountryFlag from 'react-country-flag';
import { getCode } from 'country-list';

interface Country {
  country: string;
  users: number;
}

interface TopCountriesProps {
  topCountries: Country[];
  totalUsers: number;
}

const TopCountries: React.FC<TopCountriesProps> = ({ topCountries, totalUsers }) => {
  const [showAll, setShowAll] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);

  // Show only top 2 countries by default, or all if showAll is true
  const displayedCountries = showAll ? topCountries : topCountries.slice(0, 2);
  const hasMoreCountries = topCountries.length > 2;

  const getProgressColor = (index: number) => {
    const colors = [
      'bg-blue-500',
      'bg-emerald-500', 
      'bg-amber-500',
      'bg-purple-500',
      'bg-rose-500',
      'bg-cyan-500',
      'bg-orange-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500'
    ];
    return colors[index % colors.length];
  };

  const handleToggle = () => {
    if (!showAll) {
      setIsExpanding(true);
      setTimeout(() => setIsExpanding(false), 300);
    }
    setShowAll(!showAll);
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Top Countries</h3>
        <div className="bg-blue-100 p-2 rounded-lg">
          <Globe className="w-5 h-5 text-blue-600" />
        </div>
      </div>

      <div className={`space-y-4 transition-all duration-300 ${isExpanding ? 'animate-pulse' : ''}`}>
        {displayedCountries.map((country, index) => {
          const percentage = ((country.users / totalUsers) * 100).toFixed(1);
          const countryCode = getCode(country.country);
          
          return (
            <div 
              key={country.country} 
              className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-100 hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="text-2xl">
                  {countryCode ? (
                    <ReactCountryFlag 
                      countryCode={countryCode} 
                      svg 
                      style={{
                        width: '2em',
                        height: '2em',
                      }}
                    />
                  ) : (
                    '🌍'
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-gray-900 truncate">{country.country}</div>
                  <div className="text-sm text-gray-600">{country.users.toLocaleString()} users</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 ml-4">
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900">{percentage}%</div>
                </div>
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(index)}`}
                    style={{ width: `${Math.min(parseFloat(percentage), 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {hasMoreCountries && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <button
            onClick={handleToggle}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 rounded-xl transition-all duration-200 text-blue-700 font-medium hover:shadow-md"
          >
            {showAll ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Show {topCountries.length - 2} More Countries
              </>
            )}
          </button>
        </div>
      )}

      {showAll && topCountries.length > 6 && (
        <div className="mt-4 text-center">
          <div className="text-sm text-gray-500 bg-gray-50 rounded-lg py-2 px-4">
            Showing all {topCountries.length} countries
          </div>
        </div>
      )}
    </div>
  );
};

export default TopCountries;