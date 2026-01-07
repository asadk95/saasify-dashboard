import './Card.css';

export default function Card({
  children,
  header,
  footer,
  variant = 'default',
  padding = 'md',
  hover = false,
  glow = false,
  className = '',
  onClick,
  ...props
}) {
  const classNames = [
    'card',
    `card-${variant}`,
    `card-padding-${padding}`,
    hover && 'card-hover',
    glow && 'card-glow',
    onClick && 'card-clickable',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classNames} onClick={onClick} {...props}>
      {header && <div className="card-header">{header}</div>}
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
}
