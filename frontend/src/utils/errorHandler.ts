import { isAxiosError } from 'axios';

export const getErrorMessage = (error: unknown): string => {
  if (isAxiosError(error)) {
    // Return the backend's message, or a fallback
    return error.response?.data || 'A network error occurred. Please try again.';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred.';
};
