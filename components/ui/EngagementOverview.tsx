import React from 'react';
import { Clock, TrendingUp } from 'lucide-react';

interface Props {
  engagementRate: string;
  averageSessionDuration: string;
}

const EngagementOverview: React.FC<Props> = ({ engagementRate, averageSessionDuration }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-semibold text-gray-900">Engagement Overview</h3>
      <TrendingUp className="w-5 h-5 text-gray-400" />
    </div>
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600 font-medium">Engagement Rate</span>
          <span className="text-2xl font-bold text-green-600">{engagementRate}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-1000 ease-out" 
            style={{ width: engagementRate }}
          ></div>
        </div>
      </div>
      
      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
        <span className="text-gray-600 font-medium">Average Session Duration</span>
        <span className="text-xl font-bold text-blue-600 flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          {averageSessionDuration}
        </span>
      </div>
    </div>
  </div>
);

export default EngagementOverview;
