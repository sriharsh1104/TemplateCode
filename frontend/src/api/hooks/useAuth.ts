import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../redux/hooks';
import { 
  loginSuccess, 
  logout as logoutAction, 
  sessionExpired,
  refreshToken as refreshTokenAction,
  forceLogout,
  setError, 
  setLoading 
} from '../../redux/slices/authSlice';
import authService, { LoginCredentials, SignUpData } from '../services/authService';
import queryClient from '../queryClient';
import socketService, { SocketEvent } from '../socketService';
import { useEffect } from 'react';

// Login hook
export const useLogin = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onMutate: () => {
      dispatch(setLoading(true));
      dispatch(setError(null));
    },
    onSuccess: (data, variables, context) => {
      // Check if the response has a 200 status code
      if (data) {
        dispatch(loginSuccess(data));
        
        // Initialize socket connection with the new token
        try {
          socketService.init(data.token);
        } catch (error) {
          console.error('Failed to initialize socket connection:', error);
          // Continue with login even if socket fails
        }
        
        // Navigate to dashboard
        navigate('/auth/dashboard');
      }
    },
    onError: (error: any) => {
      dispatch(setLoading(false));
      dispatch(setError(error.response?.data?.message || 'Login failed. Please try again.'));
    },
  });
};

// Sign up hook
export const useSignUp = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (userData: SignUpData) => authService.signup(userData),
    onMutate: () => {
      dispatch(setLoading(true));
      dispatch(setError(null));
    },
    onSuccess: (data, variables, context) => {
      // After successful registration, redirect to login page instead of dashboard
      dispatch(setLoading(false));
      
      // Show success message
      dispatch(setError(null));
      
      // Navigate to login page
      navigate('/', { 
        state: { 
          registrationSuccess: true,
          message: 'Registration successful! Please sign in with your credentials.'
        } 
      });
    },
    onError: (error: any) => {
      dispatch(setLoading(false));
      dispatch(setError(error.response?.data?.message || 'Registration failed. Please try again.'));
    },
  });
};

// Logout hook
export const useLogout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Disconnect socket
      socketService.disconnect();
      
      dispatch(logoutAction());
      queryClient.clear(); // Clear all queries from cache
      navigate('/');
    },
    onError: () => {
      // Even if API call fails, perform local logout
      socketService.disconnect();
      dispatch(logoutAction());
      queryClient.clear();
      navigate('/');
    },
  });
};

// Refresh token hook
export const useRefreshToken = () => {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: () => authService.refreshToken(),
    onSuccess: (data) => {
      dispatch(refreshTokenAction(data));
      socketService.updateToken(data.token);
    },
  });
};

// Current user hook
export const useCurrentUser = () => {
  const dispatch = useAppDispatch();

  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => authService.getCurrentUser(),
    enabled: !!localStorage.getItem('token'), // Only run if token exists
    onSuccess: (data) => {
      dispatch(loginSuccess(data));
      
      // Initialize socket connection
      socketService.init(data.token);
    },
    onError: () => {
      // Handle error silently, or navigate to login
      dispatch(logoutAction());
    },
  });
};

// Hook to handle socket auth events
export const useAuthSocketEvents = () => {
  const dispatch = useAppDispatch();
  // We'll wrap the navigation in a try/catch to handle potential errors
  const navigate = useNavigate();
  const refreshToken = useRefreshToken();

  useEffect(() => {
    // Function to safely navigate
    const safeNavigate = (path: string) => {
      try {
        navigate(path);
      } catch (error) {
        console.error("Navigation error:", error);
      }
    };

    // Session expired event
    const sessionExpiredUnsubscribe = socketService.on(
      SocketEvent.AUTH_SESSION_EXPIRED, 
      () => {
        dispatch(sessionExpired());
        safeNavigate('/');
      }
    );

    // Logged out from another device
    const loggedOutUnsubscribe = socketService.on(
      SocketEvent.AUTH_LOGGED_OUT, 
      () => {
        dispatch(forceLogout('You have been logged out from another device'));
        safeNavigate('/');
      }
    );

    // New login detected on another device
    const newLoginUnsubscribe = socketService.on(
      SocketEvent.AUTH_NEW_LOGIN, 
      () => {
        dispatch(forceLogout('Your account was accessed from another device'));
        safeNavigate('/');
      }
    );

    return () => {
      sessionExpiredUnsubscribe();
      loggedOutUnsubscribe();
      newLoginUnsubscribe();
    };
  }, [dispatch, navigate]);

  return {
    refreshToken: refreshToken.mutate,
    isRefreshing: refreshToken.isPending,
  };
};

// Reset password request hook
export const useRequestPasswordReset = () => {
  return useMutation({
    mutationFn: (email: string) => authService.requestPasswordReset(email),
  });
};

// Reset password hook
export const useResetPassword = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) => 
      authService.resetPassword(token, password),
    onSuccess: () => {
      navigate('/');
    },
  });
}; 