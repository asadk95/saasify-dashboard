import { TrendingUp, TrendingDown } from 'lucide-react';
import Card from '../common/Card';
import './StatsCard.css';

export default function StatsCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  iconColor = 'primary',
  loading = false
}) {
  const isPositive = change >= 0;

  if (loading) {
    return (
      <Card className="stats-card">
        <div className="stats-card-loading">
          <div className="skeleton stats-skeleton-icon"></div>
          <div className="stats-skeleton-content">
            <div className="skeleton stats-skeleton-value"></div>
            <div className="skeleton stats-skeleton-label"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="stats-card" hover>
      <div className="stats-card-header">
        <div className={`stats-card-icon stats-card-icon-${iconColor}`}>
          {Icon && <Icon size={22} />}
        </div>
        <div className={`stats-card-change ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          <span>{Math.abs(change)}%</span>
        </div>
      </div>
      <div className="stats-card-body">
        <h3 className="stats-card-value">{value}</h3>
        <p className="stats-card-title">{title}</p>
      </div>
      {changeLabel && (
        <p className="stats-card-label">{changeLabel}</p>
      )}
    </Card>
  );
}
