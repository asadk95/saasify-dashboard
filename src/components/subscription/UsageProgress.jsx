import './UsageProgress.css';

export default function UsageProgress({
  label,
  used,
  total,
  unit = '',
  showWarning = true
}) {
  const percentage = Math.min((used / total) * 100, 100);
  const isNearLimit = percentage >= 80;
  const isAtLimit = percentage >= 100;

  const formatValue = (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  return (
    <div className="usage-progress">
      <div className="usage-header">
        <span className="usage-label">{label}</span>
        <span className="usage-values">
          {formatValue(used)}{unit} / {formatValue(total)}{unit}
        </span>
      </div>
      <div className="usage-bar">
        <div
          className={`usage-fill ${isAtLimit ? 'at-limit' : isNearLimit ? 'near-limit' : ''}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showWarning && isNearLimit && !isAtLimit && (
        <p className="usage-warning">You're approaching your limit. Consider upgrading.</p>
      )}
      {showWarning && isAtLimit && (
        <p className="usage-error">You've reached your limit. Upgrade to continue.</p>
      )}
    </div>
  );
}
