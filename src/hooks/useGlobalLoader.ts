import { useEffect } from 'react';
import { useAppDispatch } from '../redux/hooks';
import { showLoader, hideLoader } from '../redux/slices/loadingSlice';

/**
 * A hook to show and hide the global loader based on a loading state.
 * 
 * @param isLoading - The loading state to monitor
 * @param message - Optional message to display in the loader
 */
export const useGlobalLoader = (isLoading: boolean, message?: string) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isLoading) {
      dispatch(showLoader(message));
    } else {
      dispatch(hideLoader());
    }

    // Always clean up the loader when component unmounts
    return () => {
      dispatch(hideLoader());
    };
  }, [isLoading, message, dispatch]);
}; 