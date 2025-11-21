import { useState, useCallback } from 'react';

/**
 * Enhanced error handler for API calls
 * Provides specific error messages based on error type
 */
const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const message = error.response.data?.message || 'เกิดข้อผิดพลาด';
    return {
      message,
      status: error.response.status,
      type: 'server',
      canRetry: error.response.status >= 500
    };
  } else if (error.request) {
    // Network error - no response received
    return {
      message: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต',
      status: 0,
      type: 'network',
      canRetry: true
    };
  } else {
    // Other errors
    return {
      message: error.message || 'เกิดข้อผิดพลาดที่ไม่คาดคิด',
      status: -1,
      type: 'unknown',
      canRetry: false
    };
  }
};

export const useApi = (apiFunc) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiFunc(...args);
      setData(response.data || response);
      
      return { success: true, data: response.data || response };
    } catch (err) {
      const errorInfo = handleApiError(err);
      setError(errorInfo);
      return { success: false, error: errorInfo };
    } finally {
      setLoading(false);
    }
  }, [apiFunc]);

  const retry = useCallback(async (...args) => {
    if (error && error.canRetry) {
      return await execute(...args);
    }
    return { success: false, error: { message: 'ไม่สามารถลองใหม่ได้' } };
  }, [error, execute]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    retry,
    reset
  };
};

export default useApi;
