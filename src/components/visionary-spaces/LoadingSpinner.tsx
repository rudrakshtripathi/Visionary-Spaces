import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  className?: string;
  size?: number; // Approx size in pixels
}

export function LoadingSpinner({ className, size = 48 }: LoadingSpinnerProps) {
  const dotSize = Math.floor(size / 6);
  const spinnerStyle = {
    width: `${size}px`,
    height: `${size}px`,
  };
  const dotStyle = {
    width: `${dotSize}px`,
    height: `${dotSize}px`,
  };

  return (
    <div
      className={cn("flex items-center justify-center space-x-1", className)}
      style={spinnerStyle}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div
        className="bg-primary rounded-full animate-pulse-opacity"
        style={{ ...dotStyle, animationDelay: '0s' }}
      />
      <div
        className="bg-primary rounded-full animate-pulse-opacity"
        style={{ ...dotStyle, animationDelay: '0.2s' }}
      />
      <div
        className="bg-primary rounded-full animate-pulse-opacity"
        style={{ ...dotStyle, animationDelay: '0.4s' }}
      />
      <style jsx>{`
        @keyframes pulse-opacity {
          0%, 100% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-pulse-opacity {
          animation: pulse-opacity 1.2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
