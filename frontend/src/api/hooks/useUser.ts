import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAppDispatch } from '../../redux/hooks';
import { updateProfile as updateProfileAction } from '../../redux/slices/authSlice';
import userService, { 
  UpdateProfileData, 
  ChangePasswordData 
} from '../services/userService';

// Get user profile hook
export const useUserProfile = () => {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: () => userService.getUserProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Update profile hook
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (data: UpdateProfileData) => userService.updateProfile(data),
    onSuccess: (data) => {
      // Update profile in Redux store if name changed
      if (data.name) {
        dispatch(updateProfileAction({ name: data.name }));
      }
      
      // Update the user profile in the cache
      queryClient.setQueryData(['userProfile'], data);
      
      // Invalidate the profile query to refresh data
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });
};

// Change password hook
export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordData) => userService.changePassword(data),
  });
};

// Upload avatar hook
export const useUploadAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => userService.uploadAvatar(file),
    onSuccess: (data) => {
      // Update the user profile in the cache with new avatar
      queryClient.setQueryData(['userProfile'], (oldData: any) => {
        if (oldData) {
          return {
            ...oldData,
            avatar: data.avatarUrl
          };
        }
        return oldData;
      });
    },
  });
};

// Get dashboard stats hook
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboardStats'],
    queryFn: () => userService.getDashboardStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}; 