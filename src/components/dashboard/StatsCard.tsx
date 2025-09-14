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
    <div className={`dashboard-card hover-lift ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="mobile-text font-medium text-muted-foreground truncate">{title}</p>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">{value}</p>
        </div>
        <div className="p-2 sm:p-3 bg-primary/10 rounded-lg flex-shrink-0">
          <Icon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-primary" />
        </div>
      </div>
    </div>
  );
}
