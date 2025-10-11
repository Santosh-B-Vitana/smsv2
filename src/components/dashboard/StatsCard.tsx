import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  className?: string;
  onClick?: () => void;
}

export function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  trend,
  className = "",
  onClick
}: StatsCardProps) {
  return (
    <div className={`dashboard-card hover-lift animate-fade-in group ${className} ${onClick ? 'cursor-pointer hover:border-primary/30' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="mobile-text font-medium text-muted-foreground truncate transition-colors group-hover:text-foreground/80">{title}</p>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground transition-colors group-hover:text-primary">{value}</p>
          {trend && (
            <p className="text-xs text-muted-foreground mt-1">
              <span className={trend.value > 0 ? 'text-emerald-600' : 'text-red-500'}>
                {trend.value > 0 ? '+' : ''}{trend.value}%
              </span>
              <span className="ml-1">{trend.label}</span>
            </p>
          )}
        </div>
        <div className="p-3 sm:p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex-shrink-0 transition-all group-hover:from-primary/20 group-hover:to-primary/10 group-hover:scale-105">
          <Icon className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-primary transition-transform group-hover:scale-110" />
        </div>
      </div>
    </div>
  );
}
