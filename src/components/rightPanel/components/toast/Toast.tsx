import { useEffect, useState } from 'react';
import './styles.scss';

interface Props {
  message: string;
  onClose: () => void;
}

export const Toast = ({ message, onClose }: Props) => {
  // We use a local state to trigger the 'exit' animation before actually unmounting
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // 1. Wait 3 seconds, then start exit animation
    const timer = setTimeout(() => {
      setIsExiting(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isExiting) {
      // 2. Wait for exit animation (300ms) to finish, then actually close
      const exitTimer = setTimeout(() => {
        onClose();
      }, 300); // Must match CSS transition time
      return () => clearTimeout(exitTimer);
    }
  }, [isExiting, onClose]);

  return (
    <div className={`toast-notification ${isExiting ? 'exiting' : ''}`}>
      <div className="toast-content">
        <span className="check-icon">✓</span>
        {message}
      </div>
      {/* The progress bar overlay */}
      <div className="toast-progress" />
    </div>
  );
};
