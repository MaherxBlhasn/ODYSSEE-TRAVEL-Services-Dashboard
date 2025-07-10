export default function AnalyticsChart() {
  return (
    <div className="h-64 flex items-end justify-around bg-gray-50 rounded-lg p-4">
      {[65, 85, 45, 75, 95, 60, 80].map((height, index) => (
        <div key={index} className="flex flex-col items-center">
          <div 
            className="w-8 bg-orange-500 rounded-t transition-all duration-500 hover:bg-orange-600"
            style={{ height: `${height}%` }}
          ></div>
          <span className="text-xs text-gray-500 mt-2">
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'][index]}
          </span>
        </div>
      ))}
    </div>
  )
}