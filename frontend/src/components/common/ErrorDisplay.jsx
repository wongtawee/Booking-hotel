import PropTypes from 'prop-types';

/**
 * ErrorDisplay component - Shows different UI based on error type
 * @param {Object} error - Error object with type, message, and canRetry
 * @param {Function} onRetry - Callback function for retry button
 */
const ErrorDisplay = ({ error, onRetry }) => {
  if (!error) return null;

  const getErrorIcon = () => {
    switch (error.type) {
      case 'network':
        return '🌐';
      case 'server':
        return '⚠️';
      case 'validation':
        return '📝';
      default:
        return '❌';
    }
  };

  const getErrorClass = () => {
    switch (error.type) {
      case 'network':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'server':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'validation':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className={`p-4 border rounded-lg ${getErrorClass()}`}>
      <div className="flex items-start gap-3">
        <span className="text-2xl">{getErrorIcon()}</span>
        <div className="flex-1">
          <p className="font-medium mb-1">
            {error.type === 'network' && 'ปัญหาการเชื่อมต่อ'}
            {error.type === 'server' && 'เกิดข้อผิดพลาดจากเซิร์ฟเวอร์'}
            {error.type === 'validation' && 'ข้อมูลไม่ถูกต้อง'}
            {!['network', 'server', 'validation'].includes(error.type) && 'เกิดข้อผิดพลาด'}
          </p>
          <p className="text-sm">{error.message}</p>
          {error.canRetry && onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 px-4 py-2 bg-white border border-current rounded hover:bg-opacity-80 transition-colors text-sm font-medium"
            >
              ลองใหม่อีกครั้ง
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

ErrorDisplay.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['network', 'server', 'validation', 'unknown']),
    canRetry: PropTypes.bool
  }),
  onRetry: PropTypes.func
};

export default ErrorDisplay;
