import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../redux/hooks';
import { loginSuccess, logout as logoutAction, setError, setLoading } from '../../redux/slices/authSlice';
import authService, { LoginCredentials, SignUpData } from '../services/authService';
import queryClient from '../queryClient';

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
    onSuccess: (data) => {
      dispatch(loginSuccess(data.user));
      navigate('/auth/dashboard');
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
    onSuccess: (data) => {
      dispatch(loginSuccess(data.user));
      navigate('/auth/dashboard');
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
      dispatch(logoutAction());
      queryClient.clear(); // Clear all queries from cache
      navigate('/');
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
    onSuccess: (user) => {
      dispatch(loginSuccess(user));
    },
    onError: () => {
      // Handle error silently, or navigate to login
      dispatch(logoutAction());
    },
  });
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