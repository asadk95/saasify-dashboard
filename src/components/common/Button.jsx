import './Button.css';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  type = 'button',
  onClick,
  className = '',
  ...props
}) {
  const classNames = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth && 'btn-full',
    loading && 'btn-loading',
    disabled && 'btn-disabled',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classNames}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <span className="btn-spinner" aria-hidden="true" />
      )}
      {!loading && Icon && iconPosition === 'left' && (
        <Icon className="btn-icon btn-icon-left" size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
      )}
      <span className="btn-text">{children}</span>
      {!loading && Icon && iconPosition === 'right' && (
        <Icon className="btn-icon btn-icon-right" size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
      )}
    </button>
  );
}
