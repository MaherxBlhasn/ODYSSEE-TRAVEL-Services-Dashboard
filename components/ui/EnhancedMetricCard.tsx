import { LucideIcon } from "lucide-react";

export const EnhancedMetricCard = ({
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
  icon: LucideIcon;
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