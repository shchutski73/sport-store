import Link from 'next/link';

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
}

export function Button({ children, href, className, type = 'button', disabled }: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

  if (href) {
    return (
      <Link href={href} className={`${baseClasses} ${className || ''}`}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} disabled={disabled} className={`${baseClasses} ${className || ''}`}>
      {children}
    </button>
  );
}