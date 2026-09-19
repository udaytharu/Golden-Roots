export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  ...props
}) {
  const classes = [
    'btn',
    variant === 'outline' && 'btn-outline',
    variant === 'dark' && 'btn-dark',
    variant === 'danger' && 'btn-danger',
    size === 'sm' && 'btn-small',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}
