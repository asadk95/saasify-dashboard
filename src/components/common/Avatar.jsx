import './Avatar.css';

export default function Avatar({
  src,
  alt = '',
  name = '',
  size = 'md',
  status,
  className = '',
  ...props
}) {
  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const classNames = [
    'avatar',
    `avatar-${size}`,
    status && 'avatar-with-status',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classNames} {...props}>
      {src ? (
        <img src={src} alt={alt || name} className="avatar-image" />
      ) : (
        <span className="avatar-initials">{getInitials(name)}</span>
      )}
      {status && (
        <span className={`avatar-status avatar-status-${status}`} />
      )}
    </div>
  );
}

// Avatar Group Component
export function AvatarGroup({ children, max = 4, size = 'md', className = '' }) {
  const childArray = Array.isArray(children) ? children : [children];
  const visible = childArray.slice(0, max);
  const remaining = childArray.length - max;

  return (
    <div className={`avatar-group avatar-group-${size} ${className}`}>
      {visible}
      {remaining > 0 && (
        <div className={`avatar avatar-${size} avatar-more`}>
          <span className="avatar-initials">+{remaining}</span>
        </div>
      )}
    </div>
  );
}
